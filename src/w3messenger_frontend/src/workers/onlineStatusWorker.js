import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory } from "../../../declarations/w3messenger_backend/w3messenger_backend.did.js";

let timerId;

self.onmessage = async ({ data }) => {

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

    if (data.type === "SET_TIMER") {
      clearTimeout(timerId);

      const timer_function = async () => {
        try {
          const status = await authenticatedCanister.getOnlineStatus(data.status_of);
          postMessage({fetchedStatus: status, statusOf:  data.status_of});
        } catch(e) {
          console.log("Something went wrong!")
        }
        timerId = setTimeout(timer_function, 5000);
      };

      timer_function();
    } else if (data.type === "CLEAR_TIMER") {
      clearTimeout(timerId);
    }
  } else {
    console.log("Not authenticated!");
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