import React, { useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import { AboutPersonStyled } from '../../../assets/styles';
import { 
    MyCanisterContext, 
    createAccountActor, 
    getTime_Date, 
    MyProfileContext, 
    UserProfileContext, 
    MyConnectionsContext, 
    InAppUseStates,
    InContentUseStates,
    ContextOfUnseenMsgCounts,
    common_Worker, 
    indvChatWorker
} from '../OtherNecessity';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { LogOut } from '../profile_and_storage/profile/LogOut';

function AboutPerson(){
    console.log("AboutPerson re-render");
    const { authenticatedCanister, myAccPrincipal } = useContext(MyCanisterContext);
    const { myProfileDetails } = useContext(MyProfileContext);
    const { userProfileDetails } = useContext(UserProfileContext);
    const { listOfConnects, setListOfConnects } = useContext(MyConnectionsContext);
    const { boolStateInApp, setBoolStateInApp } = useContext(InAppUseStates);
    const { setBoolStateInContent } = useContext(InContentUseStates);
    const { unseenMsgCounts, setUnseenMsgCounts } = useContext(ContextOfUnseenMsgCounts);

    const [open, setOpen] = useState(false);
    const [isDelOnProgress, setDelOnProgress] = useState(false);    

    const deleteChatPerson = async () => {
        setDelOnProgress(true);
        indvChatWorker.postMessage({remove: userProfileDetails.userProfilePrincipal});
        const chatAccPrincipal = await authenticatedCanister.getAccountPrincipal(userProfileDetails.userProfilePrincipal);
        const ChatActor = await createAccountActor({
            canisterId: chatAccPrincipal
        });
        const isFriend = await ChatActor.isCurrentFriend(myProfileDetails.principalOfMyAccount);
        if(isFriend){
            const curr_time_date = getTime_Date();
            const rtMsg2 = await ChatActor.createChat(myProfileDetails.principalOfMyAccount, false, "Deleted",  "", [], "", curr_time_date);
            console.log("rtmsg2 ==> "+rtMsg2);
        }
        setBoolStateInContent(prev => ({
            ...prev,
            isActive: null,
            isReload: true,
        }));
        setBoolStateInApp(prev => ({...prev, isEdit: false}));

        sessionStorage.removeItem(userProfileDetails.userProfilePrincipal);

        const { [userProfileDetails.userProfilePrincipal]: deletedValue, ...remainingValues } = unseenMsgCounts;
        setUnseenMsgCounts(remainingValues);
        sessionStorage.setItem("unseenMsgCounts", JSON.stringify(remainingValues));
        const updatedConnects = listOfConnects.filter((reqItem, id) => id !== userProfileDetails.userProfileIndex);
        setListOfConnects(updatedConnects);
        sessionStorage.setItem('listOfConnections', JSON.stringify(updatedConnects));

        common_Worker.postMessage(
            {
                what_todo: "delete contact",
                my_accId: myAccPrincipal,
                chat_with: userProfileDetails.userProfileName,
                principalOf_chatWith: userProfileDetails.userProfilePrincipal,
                index_ofChatPerson: userProfileDetails.userProfileIndex,
            }
        );
        setDelOnProgress(false);
        setOpen(false);
    };

    return(
        <AboutPersonStyled>
            <div className="about-person">
                <div className="person-info">
                    <Avatar alt="profile-img" src={boolStateInApp.isEdit ? userProfileDetails.userProfileImage : myProfileDetails.imgUrl} sx={{ width: 150, height: 150, marginTop: '8%' }}/>
                    <div className='name-id'>
                        <h2 className='name'>{boolStateInApp.isEdit ? userProfileDetails.userProfileName : myProfileDetails.userName}</h2> 
                    </div>
                </div>
                <div className="about-info">
                    <div className='about-inner'>
                        <h4>About</h4>
                        <p>{boolStateInApp.isEdit ? userProfileDetails.userProfileAbout : myProfileDetails.about}</p> 
                    </div>
                </div>
                <div className="about-footer">
                    <div 
                        className="block-delete" 
                        style={{display: !boolStateInApp.isEdit ? 'none' :''}}
                        onClick={() => setOpen(true)}
                    >
                        <div className="block-delete-person">
                            <DeleteIcon/>
                            <p>Delete Contact</p>
                        </div>
                    </div>
                    <Dialog
                        open={open}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Confirm Deletation❗️"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete {userProfileDetails.userProfileName} from your chat list?
                                <br/>
                                if you delete this person, you won't be able to receive any messages from 
                                this person until you add this person back.
                            </DialogContentText>
                        </DialogContent>
                        {isDelOnProgress ?
                            <LinearProgress />
                        :
                            <DialogActions>
                                <Button onClick={()=>setOpen(false)}>Cancel</Button>
                                <Button 
                                    onClick={() => {
                                        try{
                                            deleteChatPerson();
                                        } catch (e) {
                                            alert('Something went wrong! Try again later...');
                                        }
                                    }}
                                    autoFocus
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        }
                    </Dialog>
                    {!boolStateInApp.isEdit && <LogOut />}
                </div> 
            </div>
        </AboutPersonStyled>
    );
}

export default React.memo(AboutPerson);