import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as myAccount_idlFactory } from '../../../declarations/myAccount/myAccount.did.js';
import { idlFactory as w3messenger_backend_idlFactory } from "../../../declarations/w3messenger_backend/w3messenger_backend.did.js";

let AccActor;

self.onmessage = async ({ data }) => {

  if(data.my_accId){
    const accId = data.my_accId;
    console.log(accId);
    const localHost = "http://localhost:8000";
    const agent = new HttpAgent({host: localHost});
    await agent.fetchRootKey();
    
    AccActor = await Actor.createActor(myAccount_idlFactory, {
      agent,
      canisterId: accId,
    });
  }

  switch (data.what_todo) {
    case "delete files":
      delete_files(data.array_ofFiles);
      break;
    case "delete chats":
      delete_chats(data.array_ofChats, data.chat_with);
      break;
    case "delete all chats":
      delete_all_chats(data.chat_with);
      break;
    case "delete contact":
      delete_contact(data.chat_with, data.index_ofChatPerson, data.principalOf_chatWith);
      break;
    case "change in profile":
      Change_in_profile(data.list_of_connections, data.my_principal);
      break;
    default :
      console.log("no msg");
  }
};

const delete_files = async (array_ofFiles) => {
  try {
    let return_msg = await AccActor.deleteFile(array_ofFiles);
    postMessage({task_done: "files deleted", rmsg: return_msg});
  } catch(e) {
    postMessage({task_done: "error", rmsg: 'Something went wrong! Try again later...'});
  }
}

const delete_chats = async (array_ofChats, chat_with) => {
  try {
    const new_ArrayofChats = array_ofChats.sort(function(a, b){return b - a});
    let return_msg = await AccActor.deleteChats(new_ArrayofChats, chat_with);
    postMessage({task_done: "chats deleted", rmsg: return_msg});
  } catch(e) {
    postMessage({task_done: "error", rmsg: 'Something went wrong! Try again later...'});
  }
}

const delete_all_chats = async (chat_with) => {
  try {
    let return_msg = await AccActor.deleteAllChats(chat_with);
    postMessage({task_done: "all chats deleted", rmsg: return_msg});
  } catch(e) {
    postMessage({task_done: "error", rmsg: 'Something went wrong! Try again later...'});
  }
}

const delete_contact = async (chat_with, index_ofChatPerson, principalOf_chatWith) => {
  try {
    let return_msg = await AccActor.deleteContact(principalOf_chatWith, index_ofChatPerson);
    postMessage({task_done: "contact deleted", rmsg: return_msg+" "+chat_with+" from your contact list"});
  } catch(e) {
    postMessage({task_done: "error", rmsg: 'Something went wrong! Try again later...'});
  }
}

const Change_in_profile = async (listOfConnections, myPrincipal) => {
  try {
    const authClient = await AuthClient.create({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    });
    const identity = authClient.getIdentity();

    const authenticatedCanister = createActor(canisterId, {
      agentOptions: { identity, host: "http://localhost:8000" },
    });

    listOfConnections.forEach(async (chatPerson) => {
      const chatAccPrincipal = await authenticatedCanister.getAccountPrincipal(chatPerson.principalOfMyAccount);
      const localHost = "http://localhost:8000";
      const agent = new HttpAgent({host: localHost});
      await agent.fetchRootKey();
      const ChatActor =await Actor.createActor(myAccount_idlFactory, {
        agent,
        canisterId: chatAccPrincipal,
      });
      const isFriend = await ChatActor.isCurrentFriend(myPrincipal);
      const isRequested = await authenticatedCanister.isAlreadyRequested(chatPerson.principalOfMyAccount, myPrincipal);
      const status = await authenticatedCanister.getOnlineStatus(chatPerson.principalOfMyAccount);
      console.log('isFriend = ' + isFriend + 'isRequested = ' + isRequested + 'status = ' + status);
      if(isFriend && !isRequested && status.isOnline){
        const rtmsg = await authenticatedCanister.createRequest(chatPerson.principalOfMyAccount, myPrincipal, "Change in profile");
        console.log(rtmsg +" "+chatPerson.userName);
      }
    });
  } catch(e) {
    postMessage({task_done: "error", rmsg: 'Something went wrong! Try again later...'});
  }
}

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
  return Actor.createActor(w3messenger_backend_idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};