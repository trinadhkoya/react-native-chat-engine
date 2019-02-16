import {createStackNavigator} from "react-navigation";
import ChatRoom from "./src/ChatRoom";
import ChatList from "./src/ChatsList";
import SecretChatRoom from "./src/SecretChatRoom";
import AuthLoading from "./src/AuthLoading";


const AppNavigator = createStackNavigator({
  AuthLoading: {
    screen: AuthLoading
  },
  ChatRoom: {
    screen: ChatRoom
  },
  ChatList: {
    screen: ChatList
  },
  SecretChat: {
    screen: SecretChatRoom

  }

});


export default AppNavigator;
