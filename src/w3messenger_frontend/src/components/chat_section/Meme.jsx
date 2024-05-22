import React, { useEffect, useState, useRef, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { MyCanisterContext, createAccountActor, getTime_Date, UserProfileContext, ContextOfChats } from '../OtherNecessity';

function Meme(props){

    let ChatActor = useRef('');

    const { userProfileDetails } = useContext(UserProfileContext);
    const { authenticatedCanister, AccActor } = useContext(MyCanisterContext);
    const { listOfChats, setListOfChats } = useContext(ContextOfChats);

    const [memes, setMemes] = useState([]);
    const [memeIndex, setMemeIndex] = useState(0);
    const [captions, setCaptions] = useState([]);
    const [meme_url, setMemeUrl] = useState('');
    const [innerTextOfButton, setInnerText] = useState('Generate')

    const [memeBoolStates, setMemeBoolStates] = useState({
        isSelected: false,
        isGenerated: false,
        isGenerating: false,
        isCaptionReady: false,
    });

    const updateCaption = (e, index) => {
        setMemeBoolStates(prev => ({...prev, isCaptionReady: false}))
        const text = e.target.value || '';
        setCaptions(
            captions.map((c, i) => {
                if(index === i) {
                    return text;
                } else {
                    return c;
                }
            })
        );
    };

    const generateMeme = () => {
        for(let i = 0; i < captions.length; i++){
            if(!captions[i]?.trim()){
                setMemeBoolStates(prev => ({...prev, isCaptionReady: true}))
                return;
            }
        }
        setMemeBoolStates(prev => ({...prev, isGenerating: true}))
        setInnerText('Please wait...');
        const currentMeme = memes[memeIndex];
        const formData = new FormData();

        formData.append('username', 'sandip2023');
        formData.append('password', 'Sghosh@9093');
        formData.append('template_id', currentMeme.id);
        captions.forEach((c, index) => formData.append(`boxes[${index}][text]`, c));

        fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            body: formData
        }).then(res => {
            res.json().then(res => {
                setMemeUrl(res.data.url);
                setMemeBoolStates(prev => ({
                    ...prev, 
                    isGenerated: true,
                    isGenerating: false,
                }));
                setInnerText('Generate');
            });
        });
    };

    const fetchShuffledMemes = () => {
        fetch('https://api.imgflip.com/get_memes').then(res => {
            res.json().then(res => {
                const _memes = res.data.memes;
                shuffleMemes(_memes);
                setMemes(_memes);
            });
        });
    }

    const shuffleMemes = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * i);
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
    };

    const resetMemes = () => {
        setMemeBoolStates(prev => ({
            ...prev, 
            isSelected: false,
            isGenerated: false,
            isGenerating: false,
            isCaptionReady: false,
        }));
        try {
            fetchShuffledMemes();
        } catch(e) {
            alert('Something went wrong! Try again later...');
        }
    };

    const closeMemeGenerator = () => {
        props.setMemeGenerator(false);
        resetMemes();
    }

    const sendMeme = async () => {
        props.msg_AddingType.current = "Adding single message";
        const isFriend = await ChatActor.current.isCurrentFriend(props.myAccPrincipalText);
        if(isFriend){
            const for_loading = listOfChats.length+1;
            props.dispatchSending({ type: "SET_LOADING", id: for_loading, loading: true });
            const curr_time_date = getTime_Date();
            const updatedChats = [...listOfChats, {
                typeOfMsg: "Meme", 
                isSender: true, 
                msg: '', 
                file: null, 
                memeUrl: meme_url, 
                time_date: curr_time_date
            }];
            setListOfChats(updatedChats);
            sessionStorage.setItem(userProfileDetails.userProfilePrincipal, JSON.stringify(updatedChats));
            props.setMemeGenerator(false);
            resetMemes();
            await ChatActor.current.createChat(props.myAccPrincipalText, false, "Meme", '', [], meme_url, curr_time_date);
            await AccActor.createChat(userProfileDetails.userProfilePrincipal, true, "Meme", '', [], meme_url, curr_time_date);
            props.dispatchSending({ type: "SET_LOADING", id: for_loading, loading: false });
            const onlineStatus = await authenticatedCanister.getOnlineStatus(userProfileDetails.userProfilePrincipal);
            if(!onlineStatus.isOnline){
                ChatActor.current.updateNoOfUnseenMsgs(props.myAccPrincipalText);
            }
        } else {
            props.returnMsgTxt.current = "You are not connected with " + userProfileDetails.userProfileName;
            props.severityType.current = 'info';
            props.setOpensnack(true);
        }
    }

    useEffect(() => {
        const crActor = async () => {
            try {
                const chatAccPrincipal = await authenticatedCanister.getAccountPrincipal(userProfileDetails.userProfilePrincipal);
                ChatActor.current = await createAccountActor({
                    canisterId: chatAccPrincipal
                }); 
                fetchShuffledMemes();
            } catch(e) {
                alert('Something went wrong! Try again later... in memes');
            }
        }
        crActor();
        resetMemes();
    }, [userProfileDetails.userProfileName]);

    useEffect(() => {
        if(memes.length) {
            setCaptions(Array(memes[memeIndex].box_count).fill(''));
        }
    }, [memeIndex, memes]);

    return(
        <Dialog open={props.openMemeGenerator}>
            <CustomDialogContentHeader>
                <DialogTitle>Create Memes</DialogTitle>
                <IconButton aria-label="close" onClick={closeMemeGenerator}>
                    <CloseIcon />
                </IconButton>
            </CustomDialogContentHeader>
            <CustomDialogContent>
                {memeBoolStates.isSelected ? 
                    <div className='generate_section' style={{position: 'relative'}}>
                        <Button 
                            onClick={() => {
                                try {
                                    generateMeme();
                                } catch(e) {
                                    alert('Something went wrong! Try again later...');
                                }
                            }} 
                            style={{backgroundColor: memeBoolStates.isGenerating ? '#9fa8da' : '#5c6bc0', color: '#e3f2fd',}}
                            disabled={memeBoolStates.isGenerating}
                        >
                            {innerTextOfButton}
                        </Button>
                        {memeBoolStates.isCaptionReady && <Typography className='required_warning'>All captions are required!</Typography>}
                    </div>
                :
                    <>
                        <Button onClick={() => setMemeIndex(memeIndex + 1)} style={{backgroundColor: '#b39ddb', marginRight: '6px', color: '#e3f2fd'}}>Skip</Button>
                        <Button onClick={() => 
                        setMemeBoolStates(prev => ({...prev, isSelected: true}))
                        } style={{backgroundColor: '#42a5f5', color: '#e3f2fd'}}>Choose</Button>
                    </>
                } 
                {memeBoolStates.isSelected &&
                    <>
                        {captions.map((c, index) => {
                            const label_name = "Caption " + (index+1);
                            return(               
                                <TextField
                                    key={index}
                                    // required
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label={label_name}
                                    type="text"
                                    className='caption_input'
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => updateCaption(e, index)}
                                />
                            );
                        })}
                    </>
                }
                {memes.length && <img alt='meme' src={memeBoolStates.isGenerated ? meme_url : memes[memeIndex].url} className='meme_img'/> }
            </CustomDialogContent>
            <DialogActions>
                {memeBoolStates.isSelected && <Button onClick={resetMemes} variant="outlined">Reset</Button>}
                {memeBoolStates.isGenerated && 
                    <Button 
                        onClick={() => {
                            try {
                                sendMeme();
                            } catch(e) {
                                alert('Something went wrong! Try again later...');
                            }
                        }}
                        style={{backgroundColor: '#4db6ac', color: '#e3f2fd'}}
                    >
                        Send
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
}

export default React.memo(Meme);

const CustomDialogContentHeader = styled('div')(({ theme }) => ({
    width: `100%`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
}));

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
    '& .generate_section': {
        display: `flex`,
        alignItems: 'center',
    },
    '& .required_warning': {
        marginLeft: '6px',
        color: '#f44336'
    },
    '& .meme_img': {
        width: `100%`,
        maxHeight: `400px`,
        margin: `auto`,
        marginTop: `20px`,
        display: `block`,
        boxShadow: `0px 0px 10px black`,
    }
}));