import React, { useState, useRef, useEffect, useContext } from "react";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { 
    MyCanisterContext, 
    MyProfileContext, 
    MyConnectionsContext, 
    InAppUseStates, 
    common_Worker 
} from '../../OtherNecessity';
import Collapse from '@mui/material/Collapse';

function EditAbout(props){
    console.log("EditAbout re-render");
    const { myProfileDetails, setMyProfileDetails } = useContext(MyProfileContext);
    const { listOfConnects } = useContext(MyConnectionsContext);
    const { boolStateInApp } = useContext(InAppUseStates);
    const { authenticatedCanister } = useContext(MyCanisterContext);

    const [remainingEditedAboutLen, setEditedAboutLen] = useState('');
    const editableAbout = useRef();

    useEffect(() => {
        const lenn = 120 - myProfileDetails.about.length;
        setEditedAboutLen(lenn);
    }, [myProfileDetails.about]);

    return(
        <Collapse in={boolStateInApp.isGrowing} {...( { timeout: 1000 })}>
            <div className='profile-name-about'>
                <div className='profile-name-about-heading'>
                    <h4>About</h4>
                    <span>{remainingEditedAboutLen}</span>
                </div>
                <div className='profile-name-about-inner'>
                    {!props.isAboutFocused ?
                        <p className="your-name your-about">{myProfileDetails.about}</p>
                    :
                        <TextField
                            required
                            autoFocus
                            id="standard-required"
                            variant="standard"
                            inputProps={{ 
                                className: 'your-name input-your-name your-about',
                                maxLength: 120, 
                                autoComplete:"off",
                            }}
                            inputRef={editableAbout}
                            defaultValue={myProfileDetails.about}
                            onChange={()=>{
                                setEditedAboutLen(120-editableAbout.current.value.length);
                            }}
                        />
                    }
                    {
                        !props.isAboutFocused ?
                        <IconButton 
                            aria-label="edit" 
                            onClick={() => {props.setIsAboutFocused(true);}}
                        >
                            <EditIcon className='edit-name-icon edit-about-icon' fontSize='small'/>
                        </IconButton> : 
                        <IconButton 
                            aria-label="edit" 
                            onClick={ async () => {
                                props.setIsAboutFocused(false);
                                if(editableAbout.current.value !== myProfileDetails.about){
                                    try{
                                        const updatedProfile = {
                                            ...myProfileDetails,
                                            about: editableAbout.current.value,
                                        };
                                        setMyProfileDetails(updatedProfile);
                                        sessionStorage.setItem('myProfileDetails', JSON.stringify(updatedProfile));
                                        await authenticatedCanister.updateUserAbout(myProfileDetails.principalOfMyAccount, editableAbout.current.value);
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
                                }
                            }}
                        >
                            <DoneIcon className='edit-name-icon edit-about-icon' fontSize='small'/>
                        </IconButton>
                    }
                </div>
            </div>
        </Collapse>
    );
}

export default React.memo(EditAbout);