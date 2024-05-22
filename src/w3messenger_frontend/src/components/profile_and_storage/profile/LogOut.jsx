import React, { useContext, useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { AuthClient } from "@dfinity/auth-client";
import { 
    getTime_Date, 
    MyCanisterContext, 
    MyConnectionsContext,
    ContextOfUnseenMsgCounts,
    worker, 
    onlineWorker, 
    indvChatWorker 
} from '../../OtherNecessity';

export const LogOut = () => {

    const navigate = useNavigate();
    const { authenticatedCanister, AccActor } = useContext(MyCanisterContext);
    const { listOfConnects } = useContext(MyConnectionsContext);
    const { unseenMsgCounts } = useContext(ContextOfUnseenMsgCounts);

    const [isLoggingOut, setLoggingOut] = useState(false);

    const log_out = async () => {
        setLoggingOut(true);
        listOfConnects.forEach(item => AccActor.updateNoOfUnseenMsgsForAll(item.principalOfMyAccount, unseenMsgCounts[item.principalOfMyAccount]));
        const time_date = getTime_Date();
        const modified_timeDate = {
            date: time_date.msgDate,
            time: time_date.msgTime,
        }
        await authenticatedCanister.setOnlineStatusFalse(modified_timeDate);
        worker.postMessage({ type: "CLEAR_REQ_TIMER" });
        onlineWorker.postMessage({ type: "CLEAR_TIMER" });
        indvChatWorker.postMessage({ clearAll: true });
        const authClient = await AuthClient.create();
        await authClient.logout();
        setLoggingOut(false);
        localStorage.removeItem('isLoggedIn');
        navigate("/sign");
        // window.location.reload();
    }
    
    useEffect(() => {
        window.addEventListener("beforeunload", log_out);
      
        return () => {
          window.removeEventListener("beforeunload", log_out);
        };
    }, []);

    return(
        <>
            <LogOutStyled onClick={log_out}>
                <div className="block-delete-person">
                    <LogoutIcon/>
                    <p className='logOutText'>Log Out</p>
                </div>
            </LogOutStyled>
            <Backdrop
                sx={{ color: '#42a5f5', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoggingOut}
            >
                <InsideBackDrop>
                    <CircularProgress style={{color: "#42a5f5"}} />
                    <p>Please wait...</p>
                </InsideBackDrop>
            </Backdrop>
        </>
    );
}

const LogOutStyled = styled('div')(({ theme }) => ({
    height: `3.5em`,
    backgroundColor: `rgb(147, 112, 219, 0.1)`,
    borderRadius: `8px`,
    display: `flex`,
    justifyContent: `flex-start`,
    alignItems: `center`,
    margin: `2% 4% 2%`,
    transition: `0.5s`,
    '& .block-delete-person': {
        width: `100%`,
        display: `flex`,
        marginLeft: `4%`,
        color: `rgb(197, 75, 140)`,
        '& .logOutText': {
            fontFamily: `'Montserrat', sans-serif`,
            fontWeight: `400`,
            fontSize: `1.15em`,
            margin: `0`,
            marginLeft: `2%`,
        }
    },
    '&:hover': {
        cursor: `pointer`,
        opacity: `0.7`,
        transform: `scale(1.06)`,
    }
}));

const InsideBackDrop = styled('div')(({ theme }) => ({
    display: `flex`, 
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    '& p': {
        fontFamily: `'Montserrat', sans-serif`,
        letterSpacing: `1px`,
    }
}));