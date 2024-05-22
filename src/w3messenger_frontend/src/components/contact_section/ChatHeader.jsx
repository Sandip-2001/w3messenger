import React, { useState, useRef, useContext } from 'react';
import { ContentWrapper, StyledPaperAddPerson } from "../../../assets/styles";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import VerifiedIcon from '@mui/icons-material/Verified';
import { 
    MyCanisterContext, 
    createAccountActor, 
    MyProfileContext, 
    MyConnectionsContext, 
    InAppUseStates 
} from '../OtherNecessity';
import CancelIcon from '@mui/icons-material/Cancel';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ChatHeader () {

    const { authenticatedCanister } = useContext(MyCanisterContext);

    const { myProfileDetails } = useContext(MyProfileContext);
    const { listOfConnects } = useContext(MyConnectionsContext);
    const { setBoolStateInApp } = useContext(InAppUseStates);

    console.log("ChatHeader re-render");

    const [chatHeaderBoolStates, setChatHeaderBoolStates] = useState({
        opensnack: false,
        isOpenAddPerson: false,
        isLoading: false,
        isAddLoading: false,
        isAdded: false,
        isHidden: true,
    });

    const [fetchedUserDetails, setUserDetails] = useState({userPrincipal: "", name: "", about: "", image: ""});
    const returnMsg = useRef("");
    const inputUserName = useRef();
    const opensnackMsg = useRef("");

    const handleClosesnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setChatHeaderBoolStates(prev => ({...prev, opensnack: false}));
    };

    const searchUser = async () => {
        setChatHeaderBoolStates(prev => ({
            ...prev, 
            isAdded: false,
            isHidden: true,
            isLoading: true,
        }));
        console.log(inputUserName.current.value);
        if(inputUserName.current.value === myProfileDetails.userName){
            opensnackMsg.current = "This is your user name!";
            setChatHeaderBoolStates(prev => ({
                ...prev, 
                opensnack: true,
                isLoading: false,
            }));
            return;
        }
        const isExist = await authenticatedCanister.userNameExists(inputUserName.current.value);
        if(isExist){
            console.log("inputUserName.current.value => "+inputUserName.current.value)
            const userProfile = await authenticatedCanister.getUserProfileForAdding(inputUserName.current.value);
            const userAbout = userProfile.about;
            const imageData = userProfile.imgUrl;
            const imageContent = new Uint8Array(imageData);
            const image = URL.createObjectURL(
                new Blob([imageContent.buffer], { type: "image/*" })
            );
            setUserDetails({
                userPrincipal: userProfile.principalOfMyAccount, 
                name: userProfile.userName, 
                about: userAbout, 
                image: image
            })
            setChatHeaderBoolStates(prev => ({...prev, isHidden: false}));
        }else{
            opensnackMsg.current = "User does not exist!";
            setChatHeaderBoolStates(prev => ({...prev, opensnack: true}));
        }
        setChatHeaderBoolStates(prev => ({...prev, isLoading: false}));
    }

    function findingProfile(userPrincipalForChecking){
        return listOfConnects.some(item => item.principalOfMyAccount === userPrincipalForChecking);
    }

    const requestUser = async () => {
        setChatHeaderBoolStates(prev => ({...prev, isAddLoading: true}));
        const chatAccPrincipal = await authenticatedCanister.getAccountPrincipal(fetchedUserDetails.userPrincipal);
        const ChatActor = await createAccountActor({
            canisterId: chatAccPrincipal
        });
        const isFriend = await ChatActor.isCurrentFriend(myProfileDetails.principalOfMyAccount);
        let isProfileExist = findingProfile(fetchedUserDetails.userPrincipal);
        if(!isFriend && !isProfileExist){
            const isRequested = await authenticatedCanister.isAlreadyRequested(fetchedUserDetails.userPrincipal, myProfileDetails.principalOfMyAccount);
            if(isRequested){
                returnMsg.current = "Already requested";
            } else {
                await authenticatedCanister.createRequest(fetchedUserDetails.userPrincipal, myProfileDetails.principalOfMyAccount, "Successfully requested");
                returnMsg.current = "Successfully request sent to " + inputUserName.current.value;
            }
        }else if(isFriend && !isProfileExist){
            returnMsg.current = inputUserName.current.value + " is already connected with you, if you want to add back " + inputUserName.current.value + ", then go to OTHERS --> ADD BACK";
        }else{
            returnMsg.current = "Already connected with "+ inputUserName.current.value;
        }
        setChatHeaderBoolStates(prev => ({
            ...prev, 
            isAdded: true,
            isAddLoading: false,
        }));
    }

    const resetSerching = () => {
        inputUserName.current.value = "";
        setChatHeaderBoolStates(prev => ({
            ...prev, 
            isAdded: false,
            isHidden: true,
        }));
    }
    
    return(
        <ContentWrapper>
            <div className="chat-header">
                <div className='close-chats'>
                    <IconButton 
                        color="inherit"
                        sx={{ marginRight:'8px', display: { md: 'none' }}}
                        onClick={()=>
                            setBoolStateInApp(prev => ({...prev, isOpenPersonList: false}))
                        }
                    >
                        <ArrowBackIcon  />
                    </IconButton>
                    <h3>Chats</h3>
                </div>
                <IconButton 
                    className='add-icon' 
                    onClick={()=>
                        setChatHeaderBoolStates(prev => ({...prev, isOpenAddPerson: true}))
                    }
                >
                    <AddIcon />
                </IconButton>
            </div>
            <Drawer 
                PaperProps={{
                    component : StyledPaperAddPerson,
                    sx: {
                        background: "#32599e",  /* fallback for old browsers */
                        background: "-webkit-linear-gradient(to right, #290c49, #331245)",  /* Chrome 10-25, Safari 5.1-6 */
                        background: "linear-gradient(to right, #1d0638, #160320)",
                        color: "white"
                    }
                }}
                ModalProps={{
                    keepMounted: true, 
                }}
                sx={{
                    // width: 380,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 340,
                    },
                }}
                anchor="left" 
                open={chatHeaderBoolStates.isOpenAddPerson}
            >
                <div className='addPerson'>
                    <div className='addPerson-header'>
                        <IconButton 
                            className='close-addPerson' 
                            onClick={()=>{
                                setChatHeaderBoolStates(prev => ({...prev, isOpenAddPerson: false}));
                                resetSerching();
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <h3>Add Contact</h3>
                    </div>
                    <div className='addPerson-id'>
                        <h3>Name</h3>
                        <TextField 
                            className='addPerson-id-input' 
                            id="standard-basic" 
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon style={{color:'white', opacity:'0.7'}}/>
                                    </InputAdornment>
                                ),
                            }} 
                            placeholder="Enter Username"
                            variant="standard"
                            inputRef={inputUserName}
                            inputProps={{ maxLength: 8, autoComplete:"off" }}
                        />
                        <IconButton 
                            className='cancel_button'
                            color="inherit"
                            onClick={resetSerching}
                        >
                            <CancelIcon  style={{opacity: '0.6'}}/>
                        </IconButton>
                    </div>
                    <div className='addPerson-button'>
                        {
                            chatHeaderBoolStates.isLoading?
                                <CircularProgress className='lodeingIcon'/>
                            :   <button 
                                    onClick={() => {
                                        try {
                                            searchUser();
                                        } catch(e) {
                                            alert('Something went wrong! Try again later...');
                                        }
                                    }}
                                >
                                    Search
                                </button>
                        }
                    </div>
                    <div hidden={chatHeaderBoolStates.isHidden} className='search-result'>
                        {chatHeaderBoolStates.isAdded?
                            <div className='found'>
                                <VerifiedIcon className='added-icon' />
                                <p>{returnMsg.current}</p>
                            </div>
                        :   
                            <div className='result'>
                                <div className='profile-img'>
                                    <Avatar alt="profile" src={fetchedUserDetails.image} sx={{ width: 140, height: 140}}/>
                                </div>
                                <div className='name-about'>
                                    <h2>{fetchedUserDetails.name}</h2>
                                    <p>{fetchedUserDetails.about}</p>
                                </div>
                                {
                                    chatHeaderBoolStates.isAddLoading?
                                        <CircularProgress style={{margin:"4% 0 2%"}}/>
                                    :   <button 
                                            onClick={() => {
                                                try {
                                                    requestUser();
                                                } catch(e) {
                                                    alert('Something went wrong! Try again later...');
                                                }
                                            }}
                                        >
                                            Request
                                        </button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </Drawer>
            <Snackbar open={chatHeaderBoolStates.opensnack} autoHideDuration={3000} onClose={handleClosesnack}>
                <Alert onClose={handleClosesnack} severity="info" sx={{ width: '100%' }}>
                    {opensnackMsg.current}
                </Alert>
            </Snackbar>
        </ContentWrapper>
    );
}

export default React.memo(ChatHeader);
