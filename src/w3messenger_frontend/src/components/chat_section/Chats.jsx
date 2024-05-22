import React, { useState, useEffect, useRef, useReducer, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import document from "../../../assets/documents.png";
import RenderChat from "./RenderChat";
import { 
    MyCanisterContext,
    createAccountActor, 
    getTime_Date, 
    checkTheDay, 
    MyProfileContext, 
    UserProfileContext,
    ContextOfChats 
} from '../OtherNecessity';
import PersonHeader from './PersonHeader';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Meme from './Meme';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import PolylineIcon from '@mui/icons-material/Polyline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import groupBy from "lodash.groupby";
import dayjs from "dayjs";
import Grow from '@mui/material/Grow';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 13,
      borderRadius: '12px',
    },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialStateOfSending = {
    loading: {}
};

const reducerOfSending = (state, action) => {
    switch (action.type) {
      case "SET_LOADING":
        return {
          ...state,
          loading: { ...state.loading, [action.id]: action.loading }
        };
      default:
        return state;
    }
};

function Chats (props) {

    const { listOfChats, setListOfChats } = useContext(ContextOfChats);
    const { myProfileDetails } = useContext(MyProfileContext);
    const { userProfileDetails} = useContext(UserProfileContext);
    const { authenticatedCanister, AccActor } = useContext(MyCanisterContext);

    console.log("Chats re-render ");

    const ChatActor = useRef('');

    const messageEl = useRef(null);

    const inputMsgText = useRef();
    const returnMsgTxt = useRef("");
    const severityType = useRef("");
    const msg_AddingType = useRef("");
    const [fileDetailsObj, setFileDetailsObj] = useState("");
    const [isPreview, setPreview] = useState(false);
    const [textFieldRow, setTextFieldRow] = useState(1);
    const [opensnack, setOpensnack] = useState(false);

    const [anchorAttachMenu, setAnchorAttachMenu] = useState(null);
    const openAttachMenu = Boolean(anchorAttachMenu);
    const idOpenAttachMenu = openAttachMenu ? 'simple-popover' : undefined;

    const [openMemeGenerator, setMemeGenerator] = useState(false);

    const [checked, setChecked] = useState([]);
    const [openCheckBox, setOpenCheckBox] = useState(false);

    const imageFileTypes = ["jpeg", "jpg", "png", "svg", "gif"];

    const [sendingState, dispatchSending] = useReducer(reducerOfSending, initialStateOfSending);

    const byDate = groupBy(listOfChats, (item) => 
        dayjs(item.time_date.msgDate).format("MM/DD/YYYY")
    );

    const handleClosesnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpensnack(false);
    };

    const setFileDetails = () => {
        if(props.fileRef.current !== ""){
            const fetched_fileDetails = JSON.parse(props.fileRef.current);
            setFileDetailsObj(fetched_fileDetails);
            props.fileRef.current = "";
            setPreview(true);
        }else{
            returnMsgTxt.current ="No files selected!";
            severityType.current = 'info';
            setOpensnack(true);
        }
    }

    const handleSendMessage = async () => {
        msg_AddingType.current = "Adding single message";
        const isFriend = await ChatActor.current.isCurrentFriend(myProfileDetails.principalOfMyAccount);
        console.log("is friend ==> "+isFriend);
        console.log("my principal ==> "+myProfileDetails.principalOfMyAccount);
        if(isFriend){
            const for_loading = listOfChats.length+1;
            dispatchSending({ type: "SET_LOADING", id: for_loading, loading: true });
            const curr_time_date = getTime_Date();
            const inputMessage = inputMsgText.current.value;
            if(!(!inputMessage?.trim()) && !isPreview){
                const updatedChats = [...listOfChats, {
                    typeOfMsg: "Text", 
                    isSender: true, 
                    msg: inputMessage, 
                    file: null, 
                    memeUrl: '', 
                    time_date: curr_time_date
                }];
                setListOfChats(updatedChats);
                sessionStorage.setItem(userProfileDetails.userProfilePrincipal, JSON.stringify(updatedChats));
                inputMsgText.current.value = "";
                setTextFieldRow(1);
                await ChatActor.current.createChat(myProfileDetails.principalOfMyAccount, false, "Text", inputMessage, [], '', curr_time_date);
                await AccActor.createChat(userProfileDetails.userProfilePrincipal, true, "Text", inputMessage, [], '', curr_time_date);
            }
            if(isPreview){
                setPreview(false);
                if(!inputMessage?.trim()){
                    await sendText_File("", curr_time_date);
                } else {
                    await sendText_File(inputMessage, curr_time_date);
                }
                setFileDetailsObj("");
            }
            dispatchSending({ type: "SET_LOADING", id: for_loading, loading: false });
            const onlineStatus = await authenticatedCanister.getOnlineStatus(userProfileDetails.userProfilePrincipal);
            if(!onlineStatus.isOnline){
                ChatActor.current.updateNoOfUnseenMsgs(myProfileDetails.principalOfMyAccount);
            }
        } else {
            returnMsgTxt.current = "You are not connected with " + userProfileDetails.userProfileName;
            severityType.current = 'info';
            setOpensnack(true);
        }
    }

    const sendText_File = async (inputMsg, currTimeDate) => {
        const updated_chats = [...listOfChats, {
            typeOfMsg: "Text_File", 
            isSender: true, 
            msg: inputMsg, 
            file: [fileDetailsObj], 
            memeUrl: '', 
            time_date: currTimeDate
        }];
        setListOfChats(updated_chats);
        sessionStorage.setItem(userProfileDetails.userProfilePrincipal, JSON.stringify(updated_chats));
        inputMsgText.current.value = "";
        setTextFieldRow(1);
        await ChatActor.current.createChat(myProfileDetails.principalOfMyAccount, false, "Text_File", inputMsg, [fileDetailsObj], '', currTimeDate);
        await AccActor.createChat(userProfileDetails.userProfilePrincipal, true, "Text_File", inputMsg, [fileDetailsObj], '', currTimeDate);
    }

    // useEffect(() => {
    //     if (messageEl) {
    //       messageEl.current.addEventListener('DOMNodeInserted', event => {
    //         const { currentTarget: target } = event;
    //         target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
    //       });
    //     }
    // }, [props.refreshChats]);
    

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showLoadingInChats, setChatLoading] = useState(false);
    const prevScrollHeight = useRef(0);

    const getDynamicChats = async () => {
        const length = await AccActor.getLengthOfChats(userProfileDetails.userProfilePrincipal);
        const serverSide_chatLength = Number(length);
        const clientSide_chatLength = listOfChats.length;
        if(clientSide_chatLength !== serverSide_chatLength){
            msg_AddingType.current = "Adding multiple message";
            const fetchedDynamicChats = await AccActor.getAfterChats(clientSide_chatLength, serverSide_chatLength, userProfileDetails.userProfilePrincipal);
            const updatedListOfChats = [...fetchedDynamicChats, ...listOfChats];
            setListOfChats(updatedListOfChats);
            sessionStorage.setItem(userProfileDetails.userProfilePrincipal, JSON.stringify(updatedListOfChats));
        }
        setChatLoading(false);
    }

    const handleScroll = async () => {
        const divChat = messageEl.current;
        const isAtBottom = divChat.scrollTop <= divChat.scrollHeight - divChat.clientHeight - 150;
        if(divChat.scrollTop === 0 && !showLoadingInChats){
            setChatLoading(true);
            await getDynamicChats();
        }
        if(isAtBottom){
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
        }
    }; 

    const scrollToBottom = () => {
        const divChat = messageEl.current;
        divChat.scrollTop = divChat.scrollHeight;
    };

    useEffect(() => {
        if (messageEl.current) {
            if (msg_AddingType.current === "Adding multiple message") {
                messageEl.current.scrollTop = messageEl.current.scrollHeight - prevScrollHeight.current;
            } else {
                messageEl.current.scrollTop = messageEl.current.scrollHeight;
            }
            prevScrollHeight.current = messageEl.current.scrollHeight;
        }
    }, [listOfChats]);

    useEffect(() => {
        if (messageEl.current) {
            messageEl.current.scrollTop = messageEl.current.scrollHeight;
        }
        const crActor = async () => {
            try{
                const chatAccPrincipal = await authenticatedCanister.getAccountPrincipal(userProfileDetails.userProfilePrincipal);
                ChatActor.current = await createAccountActor({
                    canisterId: chatAccPrincipal
                });
            } catch(e) {
                alert('Something went wrong! Try again later... in chats');
            }
        }
        crActor();
    }, [userProfileDetails.userProfileName]);

    const inputMessageAndSend = (
        <>
            <TextField
                className="input-message"
                id="outlined-multiline-flexible"
                multiline
                placeholder="Write your message..."
                size="small"
                minRows={textFieldRow}  
                maxRows={4}
                inputRef={inputMsgText}
                onKeyDown={async (event)=>{
                    if(event.key == "Enter" && !event.shiftKey){
                        event.preventDefault();
                        try {
                            await handleSendMessage();
                        } catch(e) {
                            alert('Something went wrong! Try again later...');
                        }
                    }
                    if(event.key == "Enter" && event.shiftKey){
                        event.preventDefault();
                        const addNewLine = inputMsgText.current.value + '\n';
                        inputMsgText.current.value = addNewLine;
                    }
                }}
            />
            <IconButton 
                className="send-message"
                onClick={async () => {
                    try {
                        await handleSendMessage();
                    } catch(e) {
                        alert('Something went wrong! Try again later...');
                    }
                }}
            >
                <SendIcon />
            </IconButton>
        </>
    );

    return(
        <>      
            <PersonHeader
                setIsOpenPerson={props.setIsOpenPerson}
                openCheckBox={openCheckBox}
                setOpenCheckBox={setOpenCheckBox}
                checked={checked}
                setChecked={setChecked}
                setIsGrowingPerson={props.setIsGrowingPerson}
            />
            {showLoadingInChats && 
                <div className='loading_state'>
                    <div className="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            }
            <div className="chats" ref={messageEl} onScroll={handleScroll}>
                {isPreview ? 
                    <div className='backdrop-preview'>
                        <IconButton 
                            className='close-backdrop'
                            onClick={() => {
                                props.fileRef.current = "";
                                setFileDetailsObj("");
                                setPreview(false);
                            }}
                        >
                            <CloseIcon fontSize='medium'/>
                        </IconButton>
                        <div className='inside-backdrop-div'>
                            {imageFileTypes.includes(fileDetailsObj.fileType) ? "" : <h1>No preview available 😞</h1>}
                            <img 
                                src={imageFileTypes.includes(fileDetailsObj.fileType) ? fileDetailsObj.fileUrl : document} 
                                className="display-image" 
                                height={imageFileTypes.includes(fileDetailsObj.fileType) ? 300 : 150} 
                                width={imageFileTypes.includes(fileDetailsObj.fileType) ? 300 : 150}
                            />
                            <div className='backdrop-preview-details'>
                                <h3>{fileDetailsObj.fileName}</h3>
                                <p>{fileDetailsObj.fileSize}  -  {fileDetailsObj.fileType}</p>
                            </div>
                        </div> 
                    </div>
                :
                    <>
                        {Object.entries(byDate).map(([date, block], index) => {
                            const whatDay = checkTheDay(new Date(date));
                            return(
                                <div key={index} style={{display: 'flex', flexDirection: 'column'}}>
                                    <div className='forDate'>
                                        <span>
                                            {!whatDay ? dayjs(block[0].time_date.msgDate).format("DD/MM/YYYY") : whatDay}
                                        </span>
                                    </div>
                                    {block.map((item, index) => (
                                        <RenderChat
                                            key={index}
                                            indToText={index} 
                                            chat={item} 
                                            chatUser={userProfileDetails.userProfileName}
                                            fileRef={props.fileRef}
                                            setOpensnack={setOpensnack}
                                            severityType={severityType}
                                            returnMsgTxt={returnMsgTxt}
                                            sendingState={sendingState}
                                            checked={checked}
                                            setChecked={setChecked}
                                            openCheckBox={openCheckBox}
                                            messageEl={messageEl}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </>
                }
            </div>
            {showScrollButton &&
                <Grow in={showScrollButton} style={{ transformOrigin: '0 0 0' }} {...( { timeout: 400 })}>
                    <span className='scroll_to_bottom'>
                        <IconButton 
                            style={{
                                color:'white',
                                backgroundColor: '#1565c0',
                                borderRadius: '50%',
                            }}
                            onClick={scrollToBottom}
                        >
                            <KeyboardDoubleArrowDownIcon/>
                        </IconButton>
                    </span>
                </Grow>
            }
            <div className="chat-sending">
                <IconButton
                    className="attach-file"
                    onClick={(event) => setAnchorAttachMenu(event.currentTarget)}
                >
                    <AttachFileIcon />
                </IconButton>
                <StyledPopover
                    id={idOpenAttachMenu}
                    open={openAttachMenu}
                    anchorEl={anchorAttachMenu}
                    onClose={ ()=> setAnchorAttachMenu(null) }
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <div>
                        <LightTooltip title="Create Memes" placement="right">
                            <IconButton className='createMemeButton' size="large" onClick={() => setMemeGenerator(true)}>
                                <PolylineIcon/>
                            </IconButton>
                        </LightTooltip>
                    </div>
                    <div>
                        <LightTooltip title="Attach Files" placement="right">
                            <IconButton  className='attachFileButton' size="large" onClick={setFileDetails}>
                                <UploadFileIcon/>
                            </IconButton>
                        </LightTooltip>
                    </div>
                </StyledPopover>
                <Meme
                    openMemeGenerator={openMemeGenerator}
                    setMemeGenerator={setMemeGenerator}
                    dispatchSending={dispatchSending}
                    returnMsgTxt={returnMsgTxt}
                    setOpensnack={setOpensnack}
                    severityType={severityType}
                    msg_AddingType={msg_AddingType}
                    myAccPrincipalText={myProfileDetails.principalOfMyAccount}
                />
                {inputMessageAndSend}
            </div>
            <Snackbar open={opensnack} autoHideDuration={5000} onClose={handleClosesnack}>
                <Alert onClose={handleClosesnack} severity={severityType.current} sx={{ width: '100%' }}>
                    {returnMsgTxt.current}
                </Alert>
            </Snackbar>
        </>
    );
}

export default React.memo(Chats);

const StyledPopover = styled(Popover)(({ theme }) => ({
    '& .css-3bmhjh-MuiPaper-root-MuiPopover-paper' : {
        background: 'none',
    },
    '& .createMemeButton' : {
        color: '#e1f5fe',
        backgroundColor : '#ba68c8',
        marginBottom : '12px',
        '&:hover': {
            backgroundColor : '#ba68c8',
            opacity: '0.85'
        }
    },
    '& .attachFileButton' : {
        color: '#e1f5fe',
        backgroundColor : '#3f51b5',
        '&:hover': {
            backgroundColor : '#3f51b5',
            opacity: '0.85'
        }
    },
}));