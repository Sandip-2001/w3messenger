import React, { useContext } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { 
    UserProfileContext, 
    MyConnectionsContext, 
    ContextOfUnseenMsgCounts,
    InAppUseStates, 
    InContentUseStates, 
    onlineWorker, 
    ContextOfChats 
} from '../OtherNecessity';

function ListOfConnects(props) {

    console.log("ListOfConnects re-render");

    const { setListOfChats } = useContext(ContextOfChats);
    const { setUserProfileDetails } = useContext(UserProfileContext);
    const { listOfConnects } = useContext(MyConnectionsContext);
    const { setBoolStateInApp } = useContext(InAppUseStates);
    const { boolStateInContent, setBoolStateInContent } = useContext(InContentUseStates);
    const { unseenMsgCounts, setUnseenMsgCounts } = useContext(ContextOfUnseenMsgCounts);

    const countOfUnseenMsgs = unseenMsgCounts[props.connect.principalOfMyAccount];

    var lastMsg = "No messages...";
    const sessionChats = JSON.parse(sessionStorage.getItem(props.connect.principalOfMyAccount));
    if(sessionChats.length !== 0){
        const lastMsgObj = sessionChats[sessionChats.length-1];
        const last_msg = lastMsgObj.msg;
        switch(lastMsgObj.typeOfMsg){
            case 'Text':
                if(last_msg.length > 20){
                    lastMsg = last_msg.substring(0, 20) + "...";
                } else {
                    lastMsg = last_msg;
                }
                break;
            case 'Text_File':
                if(last_msg.length === 0){
                    lastMsg = "#Files";
                } else if(last_msg.length > 20){
                    lastMsg = last_msg.substring(0, 20) + "...";;
                } else {
                    lastMsg = last_msg;
                }
                break;
            case 'Meme':
                lastMsg = "#Memes"
        }
    }

    return(
        <>
            <ListItem alignItems="flex-start" 
                className={(boolStateInContent.isActive === (listOfConnects.length - 1 - props.ind))? 'chat-item active' : 'chat-item'}  
                onClick={ () => {
                    const theChats = JSON.parse(sessionStorage.getItem(props.connect.principalOfMyAccount));
                    setListOfChats(theChats);
                    setUserProfileDetails((prevProfile) => ({
                        ...prevProfile,
                        userProfileIndex : props.ind,
                        userProfilePrincipal : props.connect.principalOfMyAccount,
                        userProfileName: props.connect.userName,
                        userProfileAbout: props.connect.about,
                        userProfileImage : props.connect.imgUrl,
                    }));
                    setBoolStateInContent(prev => ({
                        ...prev,
                        isActive: listOfConnects.length - 1 - props.ind,
                        isReload: false,
                    }));
                    setBoolStateInApp(prev => ({
                        ...prev,
                        isEdit: true,
                        isOpenPersonList: false,
                    }));
                    if(countOfUnseenMsgs !== 0){
                        const updatedCountOfUnsnMsgs = { ...unseenMsgCounts, [props.connect.principalOfMyAccount]: 0 };
                        setUnseenMsgCounts(updatedCountOfUnsnMsgs);
                        sessionStorage.setItem("unseenMsgCounts", JSON.stringify(updatedCountOfUnsnMsgs));
                    }
                    onlineWorker.postMessage({
                        type: "SET_TIMER",
                        status_of: props.connect.principalOfMyAccount,
                    });
                }}
                secondaryAction={(countOfUnseenMsgs !== 0) &&
                    <UnSeenMsgDiv>
                        {countOfUnseenMsgs > 99 ? "99+" : countOfUnseenMsgs}
                    </UnSeenMsgDiv>
                }
            >
                <ListItemAvatar>
                    <Avatar alt="profile" src={props.connect.imgUrl} variant="rounded"/> 
                </ListItemAvatar>
                <ListItemText
                    primary={props.connect.userName}
                    secondary={<span className='message'>{lastMsg}</span>}
                />
            </ListItem>
            { (props.ind !== (listOfConnects.length - 1)) ? (<hr className='divider'/>) : null} 
        </> 
    );
}

export default React.memo(ListOfConnects);

const UnSeenMsgDiv = styled('div')(({ theme }) => ({
    color: 'black',
    backgroundColor: '#b388ff',
    maxWidth: '40px',
    height: '18px',
    padding: '4px 6px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '12px',
    fontWeight: '500',
}));
