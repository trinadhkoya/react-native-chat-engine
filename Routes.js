import {createStackNavigator} from "react-navigation";
import InviteUserScreen from "./src/invite-user";
import CreateChatScreen from "./src/create-chat";
import ChatsListScreen from "./src/chats-list";
import AuthorizeUserScreen from "./src/user-auth";
import ChatScreen from "./src/chat";


const AppNavigator = createStackNavigator({
  Authorize: {screen: AuthorizeUserScreen},
  ChatsList: {screen: ChatsListScreen},
  CreateChat: {screen: CreateChatScreen},
  InviteUser: {screen: InviteUserScreen},
  Chat: {screen: ChatScreen}


});


export default AppNavigator;
