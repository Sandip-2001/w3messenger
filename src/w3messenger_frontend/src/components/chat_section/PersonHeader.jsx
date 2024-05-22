import React, { useState, useContext, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { 
    MyCanisterContext, 
    UserProfileContext, 
    InAppUseStates, 
    InContentUseStates, 
    common_Worker,
    onlineWorker,
    checkTheDay,
    ContextOfChats
} from '../OtherNecessity';
import { styled } from '@mui/material/styles';

function PersonHeader (props) {

    console.log("person header re render");
    const { listOfChats, setListOfChats } = useContext(ContextOfChats);
    const { userProfileDetails, setUserProfileDetails} = useContext(UserProfileContext);
    const { setBoolStateInApp } = useContext(InAppUseStates);
    const { setBoolStateInContent } = useContext(InContentUseStates);
    const { myAccPrincipal, AccActor } = useContext(MyCanisterContext);

    const [delMsg, setDelMsg] = useState("");

    const [anchorDeleteChats, setAnchorDeleteChats] = useState(null);
    const openDeleteChats = Boolean(anchorDeleteChats);
    const idDeleteChats = openDeleteChats ? 'simple-popover' : undefined;

    const [open, setOpen] = useState(false);

    const delSelectedChats = async () => {
        let lengthOfMessages = await AccActor.getLengthOfChats(userProfileDetails.userProfilePrincipal);
        const numberOfLengthOfChats = Number(lengthOfMessages);
        const newCheckedArrays = props.checked.map(value => (numberOfLengthOfChats-listOfChats.length+value));
        setOpen(false);
        props.setOpenCheckBox(false);
        common_Worker.postMessage(
            {
                what_todo: "delete chats",
                my_accId: myAccPrincipal, 
                array_ofChats: newCheckedArrays,
                chat_with: userProfileDetails.userProfilePrincipal,
            }
        );
        const filteredArray = listOfChats.filter((element, index) => !props.checked.includes(index));
        setListOfChats(filteredArray);
        sessionStorage.setItem(userProfileDetails.userProfilePrincipal, JSON.stringify(filteredArray));
        props.setChecked([]);
    };

    const delAllChats = () => {
        setOpen(false);
        common_Worker.postMessage(
            {
                what_todo: "delete all chats",
                my_accId: myAccPrincipal,
                chat_with: userProfileDetails.userProfilePrincipal,
            }
        );
        setListOfChats([]);
        sessionStorage.setItem(userProfileDetails.userProfilePrincipal, JSON.stringify([]));
        props.setChecked([]);
    };

    const cancelSelection = () => {
        props.setOpenCheckBox(false);
        props.setChecked([]);
    }

    const [statusVisibility, setVisibility] = useState(false);
    const [onlineStatus, setStatus] = useState('');

    onlineWorker.onmessage = ({ data }) => {
        const onReceivedStatus = data.fetchedStatus;
        if(data.statusOf === userProfileDetails.userProfilePrincipal){
            if(onReceivedStatus.isOnline){
                setStatus("Online");
            } else {
                const whatDay = checkTheDay(new Date(onReceivedStatus.lastOnline[0].date));
                let notOnline = whatDay + " at " + onReceivedStatus.lastOnline[0].time;
                if(!whatDay){
                    notOnline = onReceivedStatus.lastOnline[0].date + " at " + onReceivedStatus.lastOnline[0].time;
                }
                setStatus(notOnline);
            }
        }
    }

    useEffect(() => {
        if (userProfileDetails.userProfileName) {
          // Set a timeout to show the online status after 3 seconds
          const timeout = setTimeout(() => {
            setVisibility(true);
          }, 3000);
    
          // Clean up the timeout
          return () => clearTimeout(timeout);
        } else {
          setVisibility(false);
        }
    }, [userProfileDetails.userProfileName]);

    return(
        <div className="person-header">
            <div className='person-name'>
                <IconButton onClick={() => { 
                    props.setIsOpenPerson(true); 
                    props.setIsGrowingPerson(true);
                }}>
                    <Avatar 
                        alt="Profile-img" 
                        src={userProfileDetails.userProfileImage} 
                        sx={{ marginRight:'6px' }}
                    />
                </IconButton>
                <div className={`name-container ${statusVisibility ? "show" : ""}`}>
                    <h2>{userProfileDetails.userProfileName}</h2>
                    {statusVisibility && <p className="show">{onlineStatus}</p>}
                </div>
            </div>
            <div>
                {(props.checked.length > 0) ? 
                    <Button 
                        variant="outlined" 
                        size="small"
                        style={{color:"rgb(197, 75, 140)"}}
                        onClick={() => setOpen(true)}
                    >
                        Delete
                    </Button>
                : ""}
                {props.openCheckBox ? 
                    <Button 
                        variant="outlined" 
                        size="small" 
                        style={{marginLeft:'6px'}}
                        onClick={cancelSelection}
                    >
                        Cancel
                    </Button>
                :""}
                <IconButton
                    color="inherit"
                    onClick={(event)=>setAnchorDeleteChats(event.currentTarget)}
                >
                    <MoreVertIcon />
                </IconButton>
                <Dialog
                    open={open}
                    onClose={()=>setOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Confirm Deletation❗️"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {delMsg}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => {
                                switch(delMsg){
                                    case "Are you sure you want to delete these selected messages?" :
                                        delSelectedChats();
                                        break;
                                    case "Are you sure you want to delete all these messages?" :
                                        delAllChats();
                                        break;
                                }
                            }}
                            autoFocus
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <StyledPopoverInPersonHeader
                id={idDeleteChats}
                open={openDeleteChats}
                anchorEl={anchorDeleteChats}
                onClose={ ()=> setAnchorDeleteChats(null) }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <div
                    className='chatSelection_div'
                    style={{ borderBottom: '1px solid rgb(255, 255, 255, 0.5)' }}
                    onClick={() => {
                        setDelMsg("Are you sure you want to delete these selected messages?");
                        props.setOpenCheckBox(true);
                        setAnchorDeleteChats(null);
                    }}
                >
                    Select chats
                </div>
                <div
                    className='chatSelection_div'
                    style={{ borderBottom: '1px solid rgb(255, 255, 255, 0.5)' }}
                    onClick={() => {
                        setDelMsg("Are you sure you want to delete all these messages?");
                        setOpen(true);
                        setAnchorDeleteChats(null);
                    }}
                >
                    Delete all chats
                </div>
                <div
                    className='chatSelection_div'
                    onClick={() => {
                        setBoolStateInContent(prev => ({
                            ...prev,
                            isActive: null,
                            isReload: true,
                        }))
                        setBoolStateInApp(prev => ({...prev, isEdit: false}))
                        setUserProfileDetails((prevProfile) => ({
                            ...prevProfile,
                            userProfileIndex : "",
                            userProfilePrincipal : "",
                            userProfileName: "",
                            userProfileAbout: "",
                            userProfileImage : "",
                        }));
                        onlineWorker.postMessage({
                            type: "CLEAR_TIMER",
                        });
                    }}
                >
                    Home page
                </div>
            </StyledPopoverInPersonHeader>
        </div>
    );
}

export default React.memo(PersonHeader);

const StyledPopoverInPersonHeader = styled(Popover)(({ theme }) => ({
    '& .chatSelection_div' : {
        fontFamily: "'Roboto', sans-serif",
        fontWeight: '400',
        display: 'block',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10em',
        height: '2.5em',
        cursor: 'pointer',
        padding: '4px 0 4px',
        backgroundColor: 'rgb(147, 112, 219, 0.8)',
        '&:hover': {
            backgroundColor : 'rgb(147, 112, 219, 0.7)',
        }
    },
}));