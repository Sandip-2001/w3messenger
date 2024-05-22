import React, { useState, useRef, useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import { 
    createAccountActor, 
    getTime_Date, 
    MyProfileContext, 
    MyConnectionsContext,
    indvChatWorker,
    MyCanisterContext,
    ContextOfUnseenMsgCounts
} from '../../OtherNecessity';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AddBackProfile () {

    const { myProfileDetails } = useContext(MyProfileContext);
    const { authenticatedCanister, AccActor, myAccPrincipal } = useContext(MyCanisterContext);
    const { listOfConnects, setListOfConnects } = useContext(MyConnectionsContext);
    const { unseenMsgCounts, setUnseenMsgCounts } = useContext(ContextOfUnseenMsgCounts);

    const [openAddBack, setOpenAddBack] = useState(false);
    const [opensnack, setOpensnack] = useState(false);
    const [isAddOnProgress, setAddOnProgress] = useState(false);    
    const [returnMsg, setMsg] = useState("");    

    const inputNameRef = useRef();

    const handleClickOpen = (e) => {
        setOpenAddBack(true);
    };

    const handleClose = () => {
        setOpenAddBack(false);
    };

    function findingProfile(userPrincipalForChecking){
        return listOfConnects.some(item => item.principalOfMyAccount === userPrincipalForChecking);
    };

    const handleClosesnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpensnack(false);
    };

    const handleAddBack = async () => {
        setMsg("");
        setAddOnProgress(true);
        const inputUser = inputNameRef.current.value;
        if(inputUser === myProfileDetails.userName){
            setMsg("This is your user name");
            setAddOnProgress(false);
            setOpensnack(true);
            return;
        }
        const isExist = await authenticatedCanister.userNameExists(inputUser);
        if(isExist){
            const userProfile = await authenticatedCanister.getUserProfileForAdding(inputUser);
            const resAccPrincipal = await authenticatedCanister.getAccountPrincipal(userProfile.principalOfMyAccount);
            const resAccActor = await createAccountActor({
                canisterId: resAccPrincipal 
            });
            const isFriend = await resAccActor.isCurrentFriend(myProfileDetails.principalOfMyAccount);
            let isProfileExist = findingProfile(userProfile.principalOfMyAccount);
            if(isFriend && !isProfileExist){
                await AccActor.addConnectionProfile(userProfile.principalOfMyAccount);
                const curr_time_date = getTime_Date();
                await resAccActor.createChat(myProfileDetails.principalOfMyAccount, false, "Added", "", [], "", curr_time_date);
                sessionStorage.setItem(userProfile.principalOfMyAccount, JSON.stringify([]));

                const updatedValues = { ...unseenMsgCounts, [userProfile.principalOfMyAccount]: 0 };
                setUnseenMsgCounts(updatedValues);
                sessionStorage.setItem("unseenMsgCounts", JSON.stringify(updatedValues));

                const imageContent = new Uint8Array(userProfile.imgUrl);
                const image = URL.createObjectURL(new Blob([imageContent.buffer], {type: "image/*"}));
                const updatedProfile = {...userProfile, imgUrl: image};
                const updatedList = [updatedProfile, ...listOfConnects];
                setListOfConnects(updatedList);
                sessionStorage.setItem('listOfConnections', JSON.stringify(updatedList));

                indvChatWorker.postMessage({
                    myAccId: myAccPrincipal,
                    principalOfChatWith: userProfile.principalOfMyAccount,
                });
                setAddOnProgress(false);
            }else{
                setMsg("Not applicable for "+inputUser);
                setAddOnProgress(false);
                setOpensnack(true);
                return;
            }
        }else{
            setMsg("User does not exist!");
            setAddOnProgress(false);
            setOpensnack(true);
            return;
        }
        inputNameRef.current = undefined;
        setOpenAddBack(false);
    };

    return(
        <>
            <MenuItem onClick={handleClickOpen} disableRipple>
                <AddIcon />
                Add Back
            </MenuItem>
            <Dialog open={openAddBack}>
                <DialogTitle>Add back a contact</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="User Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputRef={inputNameRef}
                        onKeyDown = {(e) => e.stopPropagation()}
                    />
                </DialogContent>
                {isAddOnProgress ?
                    <LinearProgress />
                :
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button 
                            onClick={() => {
                                try {
                                    handleAddBack();
                                } catch(e) {
                                    alert('Something went wrong! Try again later...');
                                }
                            }}
                        >
                            Add
                        </Button>
                    </DialogActions>   
                }
                <Snackbar open={opensnack} autoHideDuration={5000} onClose={handleClosesnack}>
                    <Alert onClose={handleClosesnack} severity="info" sx={{ width: '100%' }}>
                        {returnMsg}
                    </Alert>
                </Snackbar>
            </Dialog>
        </>
    );
}

export default React.memo(AddBackProfile);