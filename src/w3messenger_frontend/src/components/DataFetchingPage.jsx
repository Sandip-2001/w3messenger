import React, { useState, useEffect } from 'react';
import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/w3messenger_backend";
import { createAccountActor } from './OtherNecessity';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import loadingLogo from "../../assets/logo1.png";
import { useNavigate } from "react-router-dom";

export const DataFetchingPage = () => {

    const navigate = useNavigate();

    const [progress, setProgress] = useState(0);

    const connectionsInSessionStorage = [];
    const arrOfFiles = [];
    let unseenValues = {};

    async function setUserDetails(){
        
        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();
        const agent = new HttpAgent({ identity,
            host: "http://localhost:8000"
        });
        await agent.fetchRootKey();
        const authenticatedCanister = createActor(canisterId, {
            agentOptions: {
            identity,
            },
        });

        const profileDetails = await authenticatedCanister.getMyProfile();
        const myAccPrincipal = await authenticatedCanister.getAccountPrincipal(profileDetails.principalOfMyAccount);
        
        const AccActor = await createAccountActor({
            canisterId: myAccPrincipal 
        });

        const imageContent = new Uint8Array(profileDetails.imgUrl);
        const image = URL.createObjectURL(new Blob([imageContent.buffer], {type: "image/*"}));
        const updtedProfile = {...profileDetails, imgUrl: image}
        sessionStorage.setItem('myProfileDetails', JSON.stringify(updtedProfile));

        setProgress(5);

        await authenticatedCanister.deleteRequestFor_ChangeInProfile();

        setProgress(10);

        const listOfConnections = await AccActor.getConnectionsList();

        setProgress(15);

        for(let i = 0; i < listOfConnections.length; i++){
    
            const profilePrincipal = listOfConnections[i];
    
            let newConnectionProfile = await authenticatedCanister.getUserProfile(profilePrincipal);
                
            const imageContent = new Uint8Array(newConnectionProfile.imgUrl);
            const image = URL.createObjectURL(new Blob([imageContent.buffer], {type: "image/*"}));
            const userProfile = {...newConnectionProfile, imgUrl : image };
            connectionsInSessionStorage.unshift(userProfile);
        
            let lengthOfMessages = await AccActor.getLengthOfChats(profilePrincipal);
            const numberOfLengthOfChats = Number(lengthOfMessages);
        
            let tempArr = [];

            if(numberOfLengthOfChats > 10){
                for(let i = 0; i < 2; i++){
                    const fetchedChats = await AccActor.getAfterChats(tempArr.length, numberOfLengthOfChats, profilePrincipal);
                    tempArr = [...fetchedChats, ...tempArr];
                }
            } else if(numberOfLengthOfChats > 0 && numberOfLengthOfChats <= 10) {
                tempArr = await AccActor.getAfterChats(0, numberOfLengthOfChats, profilePrincipal);
            }
        
            sessionStorage.setItem(profilePrincipal, JSON.stringify(tempArr));
            
            const fetchedNoOfUnseenMsgs = await AccActor.getNoOfUnseenMsgs(profilePrincipal); 
            const noOfUnseenMsgs = Number(fetchedNoOfUnseenMsgs);
            unseenValues = { ...unseenValues, [profilePrincipal]: noOfUnseenMsgs };

            const prog = Math.floor( ( (i+1) / listOfConnections.length ) * 70 );
            setProgress(15+prog);
        }

        sessionStorage.setItem('listOfConnections', JSON.stringify(connectionsInSessionStorage));
        sessionStorage.setItem("unseenMsgCounts", JSON.stringify(unseenValues));

        const arrayOfFileDetails = await AccActor.getAssetsKeys();

        if(arrayOfFileDetails.length === 0){
            setProgress(100);
        }

        for(let i = 0; i < arrayOfFileDetails.length; i++){
            const file_name = arrayOfFileDetails[i].slice(8);
            const fileDetails = await AccActor.getAssetsDetails(file_name);
            arrOfFiles.unshift(fileDetails);
            const prog = Math.floor( ( (i+1) / arrayOfFileDetails.length ) * 15 );
            setProgress(85+prog);
        }
        sessionStorage.setItem("files", JSON.stringify(arrOfFiles));

        navigate('/app');
    }
    
    useEffect( () => {
        const getUsers = async () => {
            try {
                await setUserDetails();
            } catch(e) {
                alert('Something went wrong! Try again later...');
            }
        };
        getUsers(); 
        return(() => setProgress(0));
    },[]);

    return(
        <Box
            sx={{
                background: "#141E30",
                background: "-webkit-linear-gradient(to right, #11051e, #110418)",
                background: "linear-gradient(to right, #110825, #04060a)",
                color: "white",
            }}
        >
            <Grid container> 
                <Box sx={{ width: '100%' }}>
                    <StyledDataFetchingPage>
                        <div className='main_content'>
                            <div className='logo_div'>
                                <img src={loadingLogo} width={250}/>
                            </div>
                            <LinearProgress variant="determinate" value={progress} />
                            <p>Please wait...</p>
                        </div>
                    </StyledDataFetchingPage>
                </Box>
            </Grid>
        </Box>
    );
}

const StyledDataFetchingPage = styled('div')(({ theme }) => ({
    width: `100vw`,
    height: `100vh`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    '& .main_content': {
        width: `300px`,
        textAlign: `center`,
        '& .logo_div': {
            marginBottom: `20px`,
        },
        '& p': {
            fontFamily: `'Open Sans', sans-serif`,
            opacity: `0.5`,
        },
    }
}));