import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory } from "../../../declarations/w3messenger_backend/w3messenger_backend.did.js";

let reqTimerID;

self.onmessage = async ({ data }) => {

  if (data.type === "SET_REQ_TIMER") {
    const authClient = await AuthClient.create({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    });

    if(authClient.isAuthenticated()){
      const identity = authClient.getIdentity();

      const authenticatedCanister = createActor(canisterId, {
        agentOptions: { identity, host: "http://localhost:8000" },
      });
      
      // let arrLen = data.lenOfReq;
      try {
        let lengthOfRequests = await authenticatedCanister.getRequestsLength();
        let arrLen = Number(lengthOfRequests);
        for(let i = 0; i < arrLen; i++){
          let userProfile = await authenticatedCanister.getRequest(i);
          postMessage({ profile: userProfile });
        }
        // let arrLen = await authenticatedCanister.getRequestsLength(data.myPrincipal);
        async function timerFunction(){
          let lengthOfRequests = await authenticatedCanister.getRequestsLength();
          let lengthOfRequestsAsNumber = Number(lengthOfRequests);
          if(lengthOfRequestsAsNumber > arrLen){
            let userProfile = await authenticatedCanister.getRequest(lengthOfRequestsAsNumber-1);
            postMessage({ profile: userProfile });
          }
          arrLen = lengthOfRequestsAsNumber;
          reqTimerID = setTimeout(timerFunction, 5000)
        }
        
        timerFunction();
      } catch(e) {
        console.log("Something went wrong! Please refrsh the page and try...")
      }
    } else {
      console.log("Not authenticated!");
    }
  } else if (data.type === "CLEAR_REQ_TIMER") {
    clearTimeout(reqTimerID);
  }
  
};

const canisterId = process.env.W3MESSENGER_BACKEND_CANISTER_ID;

export const createActor = (canisterId, options = {}) => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }

  // Fetch root key for certificate validation during development
  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

// host: `http://${canisterId}.localhost:8000/`