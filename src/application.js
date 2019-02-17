import React from 'react';
import {View} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ChatEngineCore from 'chat-engine'
import AuthorizeUserScreen from './user-auth';
import ChatsListScreen from './chats-list';
import CreateChatScreen from './create-chat';
import InviteUserScreen from './invite-user';
import ChatScreen from './chat';


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


export default class ChatApplication extends React.Component {

    constructor(props) {
        super(props);
        console.disableYellowBox = true;
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#dbdbdb'}}>
                <Navigator screenProps={{chatEngine: ChatEngine}}/>
            </View>
        )
    }
}

/**
 * Navigation controller configuration.
 */
const Navigator = StackNavigator({
    Authorize: {screen: AuthorizeUserScreen},
    ChatsList: {screen: ChatsListScreen},
    CreateChat: {screen: CreateChatScreen},
    InviteUser: {screen: InviteUserScreen},
    Chat: {screen: ChatScreen}
});
