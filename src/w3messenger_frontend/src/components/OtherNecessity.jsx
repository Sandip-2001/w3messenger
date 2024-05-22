import React, { useState, createContext, useEffect } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/myAccount/myAccount.did.js";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/w3messenger_backend";

export const createAccountActor = async ({ canisterId }) => {
  const localHost = "http://localhost:8000";
  const agent = new HttpAgent({host: localHost});

  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId
  });
};

export const onlineWorker = new Worker(new URL('../workers/onlineStatusWorker.js', import.meta.url));
export const indvChatWorker = new Worker(new URL('../workers/indivChatWorker.js', import.meta.url));
export const common_Worker = new Worker(new URL('../workers/commonWorker.js', import.meta.url));
export const worker = new Worker(new URL('../workers/getRequestWorker.js', import.meta.url));

export const getTime_Date = () => {
  const timeDateObj = new Date();
  const currentTime = (timeDateObj.toLocaleString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })).toUpperCase();  // to get the time in 12 hrs format
  var day = timeDateObj.getDate();
  var month = timeDateObj.getMonth()+1;
  if(day.toString().length == 1) {
    day = '0'+day;
  }
  if(month.toString().length == 1) {
    month = '0'+month;
  }
  const currentdate = timeDateObj.getFullYear() + '/' + month + '/' + day;  // to get the full year
  return {
    msgDate: currentdate,
    msgTime: currentTime
  };
};

export const checkTheDay = (date) => {  
  if (!(date instanceof Date)) {
    throw new Error('Invalid argument: you must provide a "date" instance')
  }
  const D_Day = new Date();
  const is_Today = date.getDate() === D_Day.getDate() && date.getMonth() === D_Day.getMonth() && date.getFullYear() === D_Day.getFullYear();
  D_Day.setDate(D_Day.getDate() - 1);
  const is_yesterday = date.getDate() === D_Day.getDate() && date.getMonth() === D_Day.getMonth() && date.getFullYear() === D_Day.getFullYear();
  if(is_Today) {
    return 'Today';
  } else if(is_yesterday) {
    return 'Yesterday';
  } else {
    return false;
  }
};

// export const hasChildren = (element) => {
//   return React.Children.count(element.props.children) > 0;
// }

export const MyProfileContext = createContext({
  myProfileDetails: {
    principalOfMyAccount : '',
    userName: '',
    about: '',
    imgUrl : '',
  },
  setMyProfileDetails: () => {},
});

export const UserProfileContext = createContext({
  userProfileDetails: {
    userProfileIndex : "",
    userProfilePrincipal : "",
    userProfileName: "",
    userProfileAbout: "",
    userProfileImage : "",
  },
  setUserProfileDetails: () => {},
});

export const MyConnectionsContext = createContext({
  listOfConnects: [],
  setListOfConnects: () => {},
});

export const ContextOfFiles = createContext({
  listOfFiles: [],
  setListOfFiles: () => {},
});

export const ContextOfChats = createContext({
  listOfChats: [],
  setListOfChats: () => {},
});

export const ContextOfUnseenMsgCounts = createContext({
  unseenMsgCounts: {},
  setUnseenMsgCounts: () => {},
});

export const MyCanisterContext = createContext();

export const MyCanisterProvider = ({ children }) => {

  const [canisters, setCanisters] = useState(null);

  useEffect(() => {
    const createCanisters = async () => {
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
      setCanisters({ authenticatedCanister, AccActor, myAccPrincipal });
    }

    createCanisters();
  }, []);

  return (
    <MyCanisterContext.Provider value={canisters}>
      {children}
    </MyCanisterContext.Provider>
  );
};

export const InAppUseStates = createContext({
  boolStateInApp: {
    isGrowing : false,
    isEdit: true,
    open: false,
    isOpenPersonList : false,
  },
  setBoolStateInApp: () => {},
});

export const InContentUseStates = createContext({
  boolStateInContent: {
    isActive : null,
    isReload : false,
  },
  setBoolStateInContent: () => {},
});
