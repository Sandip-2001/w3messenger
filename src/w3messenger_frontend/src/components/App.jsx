import React, { useState, useEffect } from 'react';
import Header from "./Header";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Content from "./Content";
import { 
  MyProfileContext, 
  UserProfileContext,
  InAppUseStates,
  MyConnectionsContext,
  ContextOfFiles,
  ContextOfUnseenMsgCounts,
  MyCanisterProvider,
} from './OtherNecessity';
import { useNavigate } from 'react-router-dom';
import { CanisterLoader } from './CanisterLoader';
import { TransitionGroup } from 'react-transition-group';
import Grow from '@mui/material/Grow';

export const App = () => {

  const navigate = useNavigate();

  const [myProfileDetails, setMyProfileDetails] = useState({
    principalOfMyAccount : '',
    userName: '',
    about: '',
    imgUrl : '',
  });

  const [listOfConnects, setListOfConnects] = useState([]);
  const [listOfFiles, setListOfFiles] = useState([]);
  const [unseenMsgCounts, setUnseenMsgCounts] = useState({});

  const [boolStateInApp, setBoolStateInApp] = useState({
    isGrowing : false,
    isEdit: true,
    open: false,
    isOpenPersonList : false,
  });

  const [userProfileDetails, setUserProfileDetails] = useState({
    userProfileIndex : "",
    userProfilePrincipal : "",
    userProfileName: "",
    userProfileAbout: "",
    userProfileImage : "",
  });

  useEffect( () => {

    setBoolStateInApp((prevStates) => ({
      ...prevStates,
      isEdit: false,
    }));

    const storedProfileDetails = JSON.parse(sessionStorage.getItem('myProfileDetails'));
    setMyProfileDetails({
      principalOfMyAccount : storedProfileDetails.principalOfMyAccount,
      userName: storedProfileDetails.userName,
      about: storedProfileDetails.about,
      imgUrl : storedProfileDetails.imgUrl,
    });

    const storedConnections = JSON.parse(sessionStorage.getItem('listOfConnections')) || [];
    setListOfConnects(storedConnections);

    const storedFiles = JSON.parse(sessionStorage.getItem('files')) || [];
    setListOfFiles(storedFiles);

    const storedUnseenMsgCounts = JSON.parse(sessionStorage.getItem("unseenMsgCounts")) || {};
    setUnseenMsgCounts(storedUnseenMsgCounts);

  },[]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate("/sign");
    }
  }, [navigate]);

  return (
    <MyProfileContext.Provider value={{ myProfileDetails, setMyProfileDetails }}>
      <UserProfileContext.Provider value={{userProfileDetails, setUserProfileDetails}}>
        <InAppUseStates.Provider value={{ boolStateInApp, setBoolStateInApp }}>
          <MyConnectionsContext.Provider value={{ listOfConnects, setListOfConnects }}>
            <ContextOfFiles.Provider value={{ listOfFiles, setListOfFiles }}>
              <ContextOfUnseenMsgCounts.Provider value={{ unseenMsgCounts, setUnseenMsgCounts }}>
                <MyCanisterProvider>
                  <CanisterLoader>
                    <TransitionGroup>
                      <Grow {...( { timeout: 800 })}>
                        <Box
                          sx={{
                            background: "#141E30",
                            background: "-webkit-linear-gradient(to right, #11051e, #110418)",
                            background: "linear-gradient(to right, #110825, #04060a)",
                            color: "white",
                          }}
                        >
                          <Grid container>
                            <Grid item xs={12} md={12} sm={12} lg={12}>
                              <Header />
                            </Grid>  
                            <Grid item xs={12} md={12} sm={12} lg={12}>
                              <Content />
                            </Grid>  
                          </Grid>
                        </Box>
                      </Grow>
                    </TransitionGroup>
                  </CanisterLoader>
                </MyCanisterProvider>
              </ContextOfUnseenMsgCounts.Provider>
            </ContextOfFiles.Provider>
          </MyConnectionsContext.Provider>
        </InAppUseStates.Provider>
      </UserProfileContext.Provider>
    </MyProfileContext.Provider>
  );
}