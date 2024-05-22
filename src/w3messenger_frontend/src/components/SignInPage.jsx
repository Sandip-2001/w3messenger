import React, { useEffect, useState } from 'react';
import { SigninWrapper } from '../../assets/styles';
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/w3messenger_backend";
import { HttpAgent } from "@dfinity/agent";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import logo from '../../assets/logo.png';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

export const SignInPage = () => {

    const navigate = useNavigate();
    const [isSignInProgress, setSignInProgress] = useState(false);

    let authClient;
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);

    const handleClick = async () => {
        setSignInProgress(true);
        await authClient.login({
            onSuccess: async () => {
                try{
                    handleFirstAuthentication();
                } catch(e) {
                    alert('Something went wrong! Try again later...');
                }
            },
            // identityProvider: "https://identity.ic0.app/#authorize",
            identityProvider: process.env.II_URL,
            maxTimeToLive: days * hours * nanoseconds,
        });
    }

    const handleFirstAuthentication = async () => {  
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
        const isUserExist = await authenticatedCanister.isRegistered();
        if(isUserExist){
            await authenticatedCanister.setOnlineStatusTrue();
            localStorage.setItem("isLoggedIn", true);
            navigate("/fetchData");
        }else{
            navigate("/register");
        }
        setSignInProgress(false);
    }

    useEffect( () => {
        localStorage.removeItem("isLoggedIn");
        const createClient = async () => {
            authClient = await AuthClient.create();
        }
        createClient();
    },[]);

    return(
        <SigninWrapper>
          <div className="signin-main">
            <div className="signin-inner">
                <div className="logo-img">
                    <img src={logo} alt="logo" />
                </div>
                <div className="signin-content-inner">
                    <h4>Welcome to w3Messenger!</h4>
                    <h3>Sign in with Internet Computer</h3>
                    {!isSignInProgress && <Button onClick={handleClick}>Sign in</Button> }
                </div>
                {isSignInProgress &&
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                }
            </div>
          </div>
        </SigninWrapper>
    );
}