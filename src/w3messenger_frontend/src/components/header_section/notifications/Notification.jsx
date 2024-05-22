import React, {useState, useEffect, useRef, useContext} from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {
    MyCanisterContext,
    MyProfileContext, 
    UserProfileContext, 
    MyConnectionsContext,
    ContextOfUnseenMsgCounts,
    indvChatWorker,
    worker
} from '../../OtherNecessity';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Notification () {

    const { authenticatedCanister, AccActor, myAccPrincipal } = useContext(MyCanisterContext);
    const { myProfileDetails } = useContext(MyProfileContext);
    const { listOfConnects, setListOfConnects } = useContext(MyConnectionsContext);
    // const { userProfileDetails, setUserProfileDetails } = useContext(UserProfileContext);
    const { unseenMsgCounts, setUnseenMsgCounts } = useContext(ContextOfUnseenMsgCounts);

    const [open, setOpen] = useState(false);
    const [openBackDrop, setOpenBackDrop] = useState(false);

    const [anchorDeleteChats, setAnchorDeleteChats] = useState(null);
    const openDeleteChats = Boolean(anchorDeleteChats);
    const idDeleteChats = openDeleteChats ? 'simple-popover' : undefined;

    const [listOfRequests, setListOfRequests] = useState([]);

    function findingProfile(userPrincipalForChecking){
        return listOfConnects.some(item => item.principalOfMyAccount === userPrincipalForChecking);
    };

    const delRequest = async (index) => {
        try {
            const new_Ind = listOfRequests.length - 1 - index;
            await authenticatedCanister.deleteARequest(new_Ind);
            setListOfRequests(prevReqs =>
                prevReqs.filter((reqItem, id) => id !== index)
            );
        } catch(e) {
            alert('Something went wrong! Try again later...');
        }
    }

    // const updateProfile = async (profileObj, index) => {
    //     try {
    //         setOpenBackDrop(true);
    //         const indexOfChat = listOfConnects.findIndex((person) => person.principalOfMyAccount === profileObj.principalOfMyAccount);
    //         const updatedList = [...listOfConnects]; 
    //         const fetchedProfile = await authenticatedCanister.getUserProfile(profileObj.principalOfMyAccount);
    //         const imageContent = new Uint8Array(fetchedProfile.imgUrl);
    //         const image = URL.createObjectURL(new Blob([imageContent.buffer], {type: "image/*"}));
    //         if(userProfileDetails.userProfileName === updatedList[indexOfChat].userName){
    //             setUserProfileDetails((prevProfile) => ({
    //                 ...prevProfile,
    //                 userProfileName: fetchedProfile.userName,
    //                 userProfileAbout: fetchedProfile.about,
    //                 userProfileImage : image,
    //             }));
    //         }
    //         updatedList[indexOfChat].userName = fetchedProfile.userName; 
    //         updatedList[indexOfChat].about = fetchedProfile.about; 
    //         updatedList[indexOfChat].imgUrl = image; 
    //         setListOfConnects(updatedList);
    //         sessionStorage.setItem('listOfConnections', JSON.stringify(updatedList));
    //         await delRequest(index);
    //         setOpenBackDrop(false);
    //     } catch(e) {
    //         alert('Something went wrong! Please refresh the page and Try again...');
    //     }
    // } 

    const startChatting = async (profileObj, index) => {
        try {
            setOpenBackDrop(true);
            let isProfileExist = findingProfile(profileObj.principalOfMyAccount);
            if(!isProfileExist){
                const fetchedProfile = await authenticatedCanister.getUserProfile(profileObj.principalOfMyAccount);
                const imageContent = new Uint8Array(fetchedProfile.imgUrl);
                const image = URL.createObjectURL(new Blob([imageContent.buffer], {type: "image/*"}));
                const userProfile = {...fetchedProfile, imgUrl : image };
                await AccActor.addConnectionProfile(userProfile.principalOfMyAccount);

                const updatedList = [userProfile, ...listOfConnects];
                setListOfConnects(updatedList);
                sessionStorage.setItem('listOfConnections', JSON.stringify(updatedList));
                
                sessionStorage.setItem(userProfile.principalOfMyAccount, JSON.stringify([]));

                const updatedValues = { ...unseenMsgCounts, [userProfile.principalOfMyAccount]: 0 };
                setUnseenMsgCounts(updatedValues);
                sessionStorage.setItem("unseenMsgCounts", JSON.stringify(updatedValues));

                await delRequest(index);
                indvChatWorker.postMessage({
                    myAccId: myAccPrincipal,
                    principalOfChatWith: userProfile.principalOfMyAccount,
                });
            } else {
                await delRequest(index);
            }
            setOpenBackDrop(false);
        } catch(e) {
            alert('Something went wrong! Please refresh the page and Try again...');
        }
    }

    const addPerson = async (profileObj, index) => {
        await startChatting(profileObj, index);
        try {
            await authenticatedCanister.createRequest(profileObj.principalOfMyAccount, myProfileDetails.principalOfMyAccount, "Successfully added");
        } catch(e) {
            alert('Something went wrong! Please refresh the page and Try again...');
        }
    }

    worker.onmessage = function ({ data }) {
        setListOfRequests(prevConnections => {
            return [data.profile, ...prevConnections];
        });
    };

    let menuRef = useRef();

    useEffect( () => {
        if(myProfileDetails.principalOfMyAccount !== ''){
            worker.postMessage({
                type: "SET_REQ_TIMER",
                myPrincipal: myProfileDetails.principalOfMyAccount
            });
        }
    }, [myProfileDetails.principalOfMyAccount]);

    useEffect( () => {
        let handler = (e)=>{
            if(!menuRef.current.contains(e.target)){
                setOpen(false);
            }      
        };
        document.addEventListener("mousedown", handler);
        return() =>{
            document.removeEventListener("mousedown", handler);
        }
    });


    return( 
        <div className='menu-container' ref={menuRef}>
            <IconButton color="primary" style={{margin:"0 8px 0"}} onClick={()=>{setOpen(!open)}}>
                <Badge color="secondary" badgeContent={listOfRequests.length}>
                    <NotificationsActiveIcon fontSize="medium"/>
                </Badge>
            </IconButton>

            <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
                <div className='notf-head'>
                    <h3>Notifications</h3>
                </div>
                {listOfRequests.length === 0 ? 
                    <p className='no-notf'>You have no requests/notifications</p>
                :    
                    <List className='notfs'>
                        {listOfRequests.map((chat, index) =>{
                            switch(chat.status){
                            case "Successfully added" :
                                return(
                                    <ListItem
                                        key={index}
                                        alignItems="flex-start" 
                                        className='notification'
                                    >
                                        <Typography>
                                            <span style={{color:'#002E63'}}>{chat.userName} </span> 
                                            <span style={{opacity:'0.7'}}> accepted your request</span>
                                        </Typography>
                                        <Button 
                                            variant="outlined"
                                            style={{borderColor:'#002E63', color:'rgb(255,180,204)', backgroundColor:'rgb(120, 81, 169)'}}
                                            onClick={async () => await startChatting(chat, index)}
                                        >
                                            ADD
                                        </Button>
                                    </ListItem>
                                );
                            {/* case "Change in profile" :
                                const foundPerson = listOfConnects.find(person => person.principalOfMyAccount === chat.principalOfMyAccount);
                                return(
                                    <ListItem
                                        key={index}
                                        alignItems="flex-start" 
                                        className='notification'
                                    >
                                        <Typography>
                                            <span style={{opacity:'0.7'}}>Profile detials has been changed by </span>
                                            <span style={{color:'#002E63'}}> {foundPerson.userName}</span>
                                        </Typography>
                                        <Button 
                                            variant="outlined"
                                            style={{borderColor:'#002E63', color:'rgb(255,180,204)', backgroundColor:'rgb(120, 81, 169)'}}
                                            onClick={() => updateProfile(chat, index)}
                                        >
                                            Update
                                        </Button>
                                    </ListItem>
                                ); */}
                            case "Successfully requested" :
                                var about = chat.profileDetails[0].about;
                                if(about.length > 22){
                                    about = about.substring(0, 22) + "...";
                                }
                                const imageData = chat.profileDetails[0].imgUrl;
                                const imageContent = new Uint8Array(imageData);
                                const image = URL.createObjectURL(
                                    new Blob([imageContent.buffer], { type: "image/*" })
                                );
                                return(
                                    <ListItem 
                                        key={index}
                                        alignItems="flex-start" 
                                        className='notification'
                                        secondaryAction={
                                            <div>
                                                <IconButton 
                                                    className='add-button'
                                                    onClick = {async (event) => {
                                                        await addPerson(chat, index);
                                                    }}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                                <IconButton 
                                                    className='delete-button'
                                                    onClick = { async (event) => {
                                                        setOpenBackDrop(true);
                                                        await delRequest(index);
                                                        setOpenBackDrop(false);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton
                                                    className='mobile-view'
                                                    color="inherit"
                                                    onClick={(event)=>setAnchorDeleteChats(event.currentTarget)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </div>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt="Adam Lee" src={image} variant="rounded"/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={chat.userName}
                                            secondary={about}
                                        />
                                        <Popover
                                            id={idDeleteChats}
                                            open={openDeleteChats}
                                            anchorEl={anchorDeleteChats}
                                            onClose={ ()=> setAnchorDeleteChats(null) }
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            PaperProps={{
                                                sx: {
                                                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                                    background: 'rgb(147, 112, 219, 0.3)'
                                                }
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '13em',
                                                    height: 'auto',
                                                    background: 'transparent',
                                                    padding: '4px',
                                                }}
                                            >
                                                <Button 
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    style={{margin: '2px 6px'}}
                                                    onClick={async () => {
                                                        await addPerson(chat, index);
                                                        setAnchorDeleteChats(false);
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                                <Button 
                                                    variant="outlined"
                                                    color="secondary" 
                                                    startIcon={<DeleteIcon />}
                                                    style={{margin: '2px 6px'}}
                                                    onClick={ async (event) => {
                                                        setOpenBackDrop(true);
                                                        await delRequest(index);
                                                        setOpenBackDrop(false);
                                                        setAnchorDeleteChats(false);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Popover>
                                    </ListItem>
                                );
                            }
                        })}
                    </List>
                }
            </div>
            <Backdrop
                sx={{ color: '#42a5f5', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackDrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default React.memo(Notification);