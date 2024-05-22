import React, { useRef, useState, useEffect, useContext } from "react";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import DoneIcon from '@mui/icons-material/Done';
import { 
    InAppUseStates, 
    MyCanisterContext, 
    MyProfileContext, 
    MyConnectionsContext,
    common_Worker 
} from '../../OtherNecessity';
import Collapse from '@mui/material/Collapse';

function EditName(props){
    console.log("EditName re-render ");
    const { myProfileDetails, setMyProfileDetails } = useContext(MyProfileContext);
    const { listOfConnects } = useContext(MyConnectionsContext);
    const { boolStateInApp } = useContext(InAppUseStates);
    const { authenticatedCanister } = useContext(MyCanisterContext);

    const [isEditedNameExist, setEditedNameExist] = useState(false);
    const [progress, setProgress] = useState(false);
    const [remainingEditedNameLen, setEditedNameLen] = useState('');
    const editableName = useRef();

    useEffect(() => {
        const lenn = 8 - myProfileDetails.userName.length;
        setEditedNameLen(lenn);
    }, [myProfileDetails.userName]);

    return(
        <Collapse in={boolStateInApp.isGrowing} {...( { timeout: 800 })}>
            <div className='profile-name-about'>
                <div className='profile-name-about-heading'>
                    <h4>Your name</h4>
                    <span>{remainingEditedNameLen}</span>
                </div>
                <div className='profile-name-about-inner'>
                    {!props.isNameFocused ?
                        <h2 className='your-name'>{myProfileDetails.userName}</h2> 
                    :
                        <TextField
                            required
                            autoFocus
                            id="standard-required"
                            variant="standard"
                            inputProps={{
                                className: 'your-name input-your-name',
                                maxLength: 8, 
                                autoComplete:"off",
                            }}
                            inputRef={editableName}
                            defaultValue={myProfileDetails.userName}
                            onChange={()=>{
                                setEditedNameLen(8-editableName.current.value.length);
                                setEditedNameExist(false);
                            }}
                        />
                    }
                    {
                        !props.isNameFocused ?
                        <IconButton 
                            aria-label="edit" 
                            onClick={() => {props.setIsNamedFocused(true);}}
                        >
                            <EditIcon className='edit-name-icon' fontSize='small'/>
                        </IconButton> : 
                        <>
                            {progress ?
                                <CircularProgress color="secondary"/>
                            :
                                <IconButton 
                                    aria-label="edit" 
                                    onClick={ async () => {
                                        setProgress(true);
                                        if(editableName.current.value === myProfileDetails.userName){
                                            props.setIsNamedFocused(false);
                                        } else {
                                            const isExist = await authenticatedCanister.userNameExists(editableName.current.value);
                                            if(isExist){
                                                setEditedNameExist(true);
                                            }else{
                                                try{
                                                    const updatedProfile = {
                                                        ...myProfileDetails,
                                                        userName: editableName.current.value,
                                                    };
                                                    setMyProfileDetails(updatedProfile);
                                                    sessionStorage.setItem('myProfileDetails', JSON.stringify(updatedProfile));
                                                    await authenticatedCanister.updateUserName(myProfileDetails.userName, editableName.current.value, myProfileDetails.principalOfMyAccount);
                                                    // common_Worker.postMessage(
                                                    //     {
                                                    //         what_todo: "change in profile",
                                                    //         list_of_connections: listOfConnects,
                                                    //         my_principal: myProfileDetails.principalOfMyAccount,
                                                    //     }
                                                    // );
                                                }catch (error){
                                                    alert('Something went wrong! Try again later...');
                                                }
                                                props.setIsNamedFocused(false);
                                            }
                                        }
                                        setProgress(false);
                                    }}
                                >
                                    <DoneIcon className='edit-name-icon' fontSize='small'/>
                                </IconButton>
                            }
                        </>
                    }
                </div>
                {isEditedNameExist && <p>Username already exists</p> }
            </div>
        </Collapse>
    );
}

export default React.memo(EditName);