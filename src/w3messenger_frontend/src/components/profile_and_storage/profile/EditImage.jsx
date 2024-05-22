import React, { useState, useContext } from "react";
import Avatar from '@mui/material/Avatar';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Popover from '@mui/material/Popover';
import { imageCompressor } from "../../ImageCompression";
import { 
    MyCanisterContext, 
    MyProfileContext, 
    MyConnectionsContext, 
    InAppUseStates,
    common_Worker 
} from '../../OtherNecessity';
import Grow from '@mui/material/Grow';
import { styled } from '@mui/material/styles';
import defPic from "../../../../assets/defImg.png";

function EditImage(){
    console.log("EditImage re-render");

    const { myProfileDetails, setMyProfileDetails } = useContext(MyProfileContext);
    const { listOfConnects } = useContext(MyConnectionsContext);
    const { boolStateInApp } = useContext(InAppUseStates);
    const { authenticatedCanister } = useContext(MyCanisterContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const openProfilePhotoEdit = Boolean(anchorEl);

    const idProfilePhotoEdit = openProfilePhotoEdit ? "simple-popover" : undefined;

    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    const updateProfilePhoto = async (picToSet) => {
        const imBlob = await imageCompressor(picToSet);
        const imageArray = await imBlob.arrayBuffer();
        const imageByteData = [...new Uint8Array(imageArray)];
        try{
            await authenticatedCanister.updateUserImage(myProfileDetails.principalOfMyAccount, imageByteData);
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

    const removingPhoto = async () => {
        const updatedprofile = {...myProfileDetails, imgUrl: defPic}
        setMyProfileDetails(updatedprofile);
        sessionStorage.setItem('myProfileDetails', JSON.stringify(updatedprofile));
        const response = await fetch(defPic);
        const previmgBlob = await response.blob();
        await updateProfilePhoto(previmgBlob);
    }

    const updatingPhoto = async (event) => {
        event.preventDefault();
        const updatedprofile = {...myProfileDetails, imgUrl: URL.createObjectURL(event.target.files[0])}
        setMyProfileDetails(updatedprofile);
        sessionStorage.setItem('myProfileDetails', JSON.stringify(updatedprofile));
        await updateProfilePhoto(event.target.files[0]);
    }

    return(
        <div className='profile-img'>
            <Grow in={boolStateInApp.isGrowing} style={{ transformOrigin: '0 0 0' }} {...( { timeout: 1000 })}>
                <div 
                    className='profile-img-inner'
                    aria-describedby={idProfilePhotoEdit} 
                    variant="contained"
                    onClick={(event)=>{
                        setAnchorEl(event.currentTarget);
                        setMouseX(event.clientX);
                        setMouseY(event.clientY);
                    }}
                >
                    <Avatar className='profile-pic' alt="Adam Lee" src={myProfileDetails.imgUrl} sx={{ width: 180, height: 180}}/>
                    <div className='edit-photo'>
                        <CameraAltIcon fontSize='large'/>
                        <p>EDIT PROFILE PHOTO</p>
                    </div>
                </div>
            </Grow>
            <StyledPopoverEditImage
                id={idProfilePhotoEdit}
                anchorReference="anchorPosition"
                anchorPosition={{ top: mouseY, left: mouseX }}
                open={openProfilePhotoEdit}
                anchorEl={anchorEl}
                onClose={()=>setAnchorEl(null)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
            >
                <div>
                    <input 
                        accept='image/*'
                        id='file'
                        type="file" 
                        className='edit_photoInput'
                        onChange={updatingPhoto}
                    />
                    <label 
                        className='edit_photo'
                        style={{ position: 'relative' }}
                        htmlFor="file" 
                    >
                        Upload Photo
                        <p style={{display:'none'}}></p>
                    </label>
                </div>
                <div 
                    className='edit_photo'
                    onClick={removingPhoto}
                >
                    Remove Photo
                </div>
            </StyledPopoverEditImage>
        </div>
    );
}

export default React.memo(EditImage);

const StyledPopoverEditImage = styled(Popover)(({ theme }) => ({

    '& .edit_photoInput' : {
        opacity: '0',
        width: '0.1px',
        height: '0.1px',
        position: 'absolute'
    },
    '& .edit_photo' : {
        fontFamily: "'Roboto', sans-serif",
        fontWeight: '400',
        display: 'block',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10em',
        height: '2.5em',
        cursor: 'pointer',
        backgroundColor: 'rgb(147, 112, 219, 0.8)',
        padding: '4px 0 4px',
        '&:hover': {
            backgroundColor: 'rgb(147, 112, 219, 0.6)',
        },
    }
}));