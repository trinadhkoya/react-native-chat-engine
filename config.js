/**
 * @link https://www.pubnub.com/docs/chat-engine/reference/chatenginecore
 * @type {ChatEngine}
 */

import ChatEngineCore from "chat-engine";

const ChatEngine = ChatEngineCore.create({
      publishKey: 'pub-c-d022ec6d-deb3-4d4b-9071-8aaca7ba3cf1',
      subscribeKey: 'sub-c-d33beaaa-3158-11e9-adfd-d6dadac83966',
      autoNetworkDetection: true,//optional,
      restore: true//he SDK catches up the missed messages on network reconnects, on the front-end applications

    },
    {
      globalChannel: 'tm',//by default chat-engine,limit is 91 characters(tm means my company UUID)
      enableSync: true,//Synchronizes chats between instances with the same Me#uuid. See Me#sync.(same UUID with multiple Devices)

    });


export default ChatEngine;
// globalChannel(by )
/*
ChatEngine.global.on('message', () => {});

console.log(ChatEngine.global.channel);
*/



// globalChannel + '#chat#private.*'


// globalChannel + '#user#' + myUUID + '#write.*'
// This is the namespace containing User owned Chats. The user who's User#uuid matches myUUID has all permissions, while other Users only have write permissions. User#direct belongs to this namespace.

/*
let joe = new ChatEngine.User('joe');

console.log(joe.direct.channel);
// joe.direct.channel == "chat-engine#user#joe#write#direct"
*/


// globalChannel + '#user#' + myUUID + '#read.*'

// This is the namespace containing User owned Chats. The user who's User#uuid matches myUUID has all permissions, while other Users only have read permissions. User#feed belongs to this namespace.


