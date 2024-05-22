import React, { useState, useEffect, useRef, useContext } from 'react';
import { ContentWrapper, StyledPaperMyProfile } from "../../assets/styles";
import midImg from "../../assets/midImg1.png";
import DfinityLogo from "../../assets/logo-2.png";
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Chats from './chat_section/Chats';
import ProfileAndStorage from "./profile_and_storage/ProfileAndStorage";
import AboutPerson from './about_person/AboutPerson';
import AboutPersonDrawer from './about_person/AboutPersonDrawer';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { 
    UserProfileContext, 
    InAppUseStates, 
    InContentUseStates,
    common_Worker, 
    indvChatWorker,
    ContextOfChats,
    ContextOfUnseenMsgCounts,
    MyCanisterContext,
    MyConnectionsContext
} from './OtherNecessity';
import ConnectionListSection from './contact_section/ConnectionListSection';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Content () { 
    
    console.log("Content re-render");
    const [listOfChats, setListOfChats] = useState([]);
    const { unseenMsgCounts, setUnseenMsgCounts } = useContext(ContextOfUnseenMsgCounts);

    const { boolStateInApp } = useContext(InAppUseStates);
    const { userProfileDetails } = useContext(UserProfileContext);
    const { myAccPrincipal } = useContext(MyCanisterContext);
    const { listOfConnects } = useContext(MyConnectionsContext);

    const [boolStateInContent, setBoolStateInContent] = useState({
        isActive : null,
        isReload : false,
    });

    const [isOpenPerson, setIsOpenPerson] = useState(false);

    const [opensnack, setOpensnack] = useState(false);
    const [alertmessage, setAlertMessage] = useState("");
    const severityType = useRef("");

    const [isGrowingPerson, setIsGrowingPerson] = useState(false);

    const nameRef = useRef(userProfileDetails.userProfilePrincipal);

    const fileRef = useRef("");

    useEffect(() => {
        nameRef.current = userProfileDetails.userProfilePrincipal;
    }, [userProfileDetails.userProfilePrincipal]);

    const handleClosesnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpensnack(false);
    };

    indvChatWorker.onmessage = ({data}) => {

        const {new_msg, chat_with} = data;
        const curr_name = nameRef.current;

        if(chat_with ===  curr_name){
            setListOfChats(prevChats => [...prevChats, new_msg]);
        }    

        let chatArr = JSON.parse(sessionStorage.getItem(chat_with));
        chatArr.push(new_msg);
        sessionStorage.setItem(chat_with, JSON.stringify(chatArr));

        if(chat_with !==  curr_name){
            const updatedValues = { ...unseenMsgCounts, [chat_with]: unseenMsgCounts[chat_with]+1 };
            setUnseenMsgCounts(updatedValues);
            sessionStorage.setItem("unseenMsgCounts", JSON.stringify(updatedValues));
        }
    };

    common_Worker.onmessage = ({data}) => {
        switch (data.task_done) {
            case "files deleted":
                setAlertMessage(data.rmsg);
                severityType.current = "success"
                setOpensnack(true);
                break;
            case "chats deleted":
                setAlertMessage(data.rmsg);
                severityType.current = "success"
                setOpensnack(true);
                break;
            case "all chats deleted":
                setAlertMessage(data.rmsg);
                severityType.current = "success"
                setOpensnack(true);
                break;
            case "contact deleted":
                setAlertMessage(data.rmsg);
                severityType.current = "success"
                setOpensnack(true);
                break;
            case "error":
                setAlertMessage(data.rmsg);
                severityType.current = "error"
                setOpensnack(true);
                break;
            default:
                console.log("no msg");
        }
    };
    

    useEffect(() => {
        setBoolStateInContent(prev => ({...prev, isReload: true}))
        listOfConnects.forEach(eachConnect => {
            indvChatWorker.postMessage({
                myAccId: myAccPrincipal,
                principalOfChatWith: eachConnect.principalOfMyAccount,
            });
        });  
    }, []);

    const personListDrawer = (
        <InContentUseStates.Provider value={{ boolStateInContent, setBoolStateInContent }}>
            <ContextOfChats.Provider value={{ listOfChats, setListOfChats }}>
                <ConnectionListSection />
            </ContextOfChats.Provider>
        </InContentUseStates.Provider>
    );
    
    return(
        <ContentWrapper>
            <Grid container>
                <Grid item xs={8} md={3} sm={8} lg={3} sx={{ display: { md: 'block', xs: 'none' } }}>
                    {personListDrawer}
                </Grid>
                <Drawer 
                    PaperProps={{
                        component : ContentWrapper,
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
                        display: { md: 'none', xs: 'block' },
                        // width: 380,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 340,
                        },
                    }}
                    anchor="left" 
                    open={boolStateInApp.isOpenPersonList}
                >
                    {personListDrawer}
                </Drawer>
                <Grid item xs={12} md={6} sm={12} lg={6}>
                    <div className="person" >
                        {boolStateInContent.isReload ? 
                            <div className='reload-person'>
                                <div className='reload-img'>
                                    <img src={midImg} alt='mid-background' />
                                </div>
                                <div className='reload-about'>
                                    <p>Now send and receive messages with Web 3.0</p>
                                    <p>The Internet Computer Blockchain</p>
                                </div>
                                <div className='backend-technology'>
                                    <img src={DfinityLogo} alt='mid-background' />
                                </div>
                            </div>
                            :
                            <InContentUseStates.Provider value={{ setBoolStateInContent }}>
                                <ContextOfChats.Provider value={{ listOfChats, setListOfChats }}>
                                    <Chats
                                        setIsOpenPerson={setIsOpenPerson}
                                        fileRef={fileRef}
                                        setIsGrowingPerson={setIsGrowingPerson}
                                    />
                                </ContextOfChats.Provider>
                            </InContentUseStates.Provider>
                        }
                    </div>
                </Grid>
                <Grid item xs={8} md={3} sm={8} lg={3} sx={{ display: { md: 'block', xs: 'none' } }}>
                    <InContentUseStates.Provider value={{ setBoolStateInContent }}>
                        <AboutPerson />
                    </InContentUseStates.Provider>
                </Grid>
                <Drawer 
                    PaperProps={{
                        component : ContentWrapper,
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
                        display: { md: 'none', xs: 'block' },
                        // width: 380,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 340,
                        },
                    }}
                    anchor="left" 
                    open={isOpenPerson}
                >
                    <AboutPersonDrawer 
                        setIsOpenPerson={setIsOpenPerson}
                        isGrowingPerson={isGrowingPerson}
                        setIsGrowingPerson={setIsGrowingPerson}
                    />
                </Drawer>
                
                {/* My Profile edit section */}
                <Drawer 
                    PaperProps={{
                        component : StyledPaperMyProfile,
                        sx: {
                            background: "#141E30",  /* fallback for old browsers */
                            background: "-webkit-linear-gradient(to right, #11051e, #110418)",  /* Chrome 10-25, Safari 5.1-6 */
                            background: "linear-gradient(to right, #110825, #04060a)", /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                            color: "white"
                        }
                    }}
                    ModalProps={{
                        keepMounted: true, 
                    }}
                    sx={{
                        // width: 340,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 340,
                        },
                    }}
                    anchor="right" 
                    open={boolStateInApp.open}
                >
                    <ProfileAndStorage fileRef={fileRef} />
                </Drawer>
            </Grid>
            <Snackbar open={opensnack} autoHideDuration={6000} onClose={handleClosesnack}>
                <Alert onClose={handleClosesnack} severity={severityType.current} sx={{ width: '100%' }}>
                    {alertmessage}
                </Alert>
            </Snackbar>
        </ContentWrapper>
    );
}

export default Content;