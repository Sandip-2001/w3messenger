import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/myAccount/myAccount.did.js';

let timers = {};

self.onmessage = async ({data}) => {

  if (data.clearAll) {
    Object.keys(timers).forEach(key => {
      clearTimeout(timers[key]);
      delete timers[key];
    });
    return;
  }

  if (data.remove) {
    clearTimeout(timers[data.remove]);
    delete timers[data.remove];
    return;
  }

  const accId = data.myAccId;
  console.log(accId);
  const localHost = "http://localhost:8000";
  const agent = new HttpAgent({host: localHost});
  await agent.fetchRootKey();
  const AccActor =await Actor.createActor(idlFactory, {
    agent,
    canisterId: accId,
  });

  try {
    let length = await AccActor.getLengthOfChats(data.principalOfChatWith);
    let numberOfLength = Number(length);

    const timerFunction = async () => {
      const lengthOfChatObjs = await AccActor.getLengthOfChats(data.principalOfChatWith);
      const numberOfLengthOfChatObjs = Number(lengthOfChatObjs);
      if(numberOfLengthOfChatObjs > numberOfLength){
        let message = await AccActor.getChat(data.principalOfChatWith, numberOfLengthOfChatObjs-1);
        if(!message.isSender){
          postMessage(
            {
              new_msg: message, 
              chat_with: data.principalOfChatWith,
            }
          );
        }
      }
      numberOfLength = numberOfLengthOfChatObjs;
      timers[data.principalOfChatWith] = setTimeout(timerFunction, 100);
    }

    timerFunction();
  } catch(e) {
    console.log("Something went wrong! Please refrsh the page and try...")
  }
};