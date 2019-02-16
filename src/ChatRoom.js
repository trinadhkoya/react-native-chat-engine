import {Keyboard, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import sha1 from "sha1";

class ChatRoom extends React.Component {

  constructor(props, context) {
    super(props, context);
    console.log(props);
    this.state={inviteEmail:String(),loginDisabled:false}
  }


  onLoginTap(dismissKeyboard = true) {

    const {inviteEmail} = this.state;
    const {navigation,screenProps}=this.props;
    const chat = navigation.getParam('chat', {});
    const ChatEngine = screenProps.chatEngine;



    if (dismissKeyboard) {
      Keyboard.dismiss();
    }
    this.setState({inviteEmail: inviteEmail, loginDisabled: true});
    let someXPerson = new ChatEngine.User(sha1(inviteEmail));
    chat.invite(someXPerson);
    console.log(chat);


  }


  onTextInputSubmit() {
    if (!this.state.inviteDisabled) {
      this.onLoginTap(false);
    }
  }

  render() {
    const {navigation}=this.props;
    const chat = navigation.getParam('chat', {});
    console.log(chat);
    // const otherParam = navigation.getParam('otherParam', 'some default value');

    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Chat Room</Text>
          <TextInput
              style={styles.input}
              value={this.state.inviteEmail}
              maxLength={80}
              // editable={this.state.inviteEmail}
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={true}
              placeholder={'Enter Invite Email '}
              returnKeyType={'go'}
              onChangeText={(text) => {
                this.setState({inviteEmail: text});
                this.setState({loginDisabled: this.state.inviteEmail.length < 6});
              }}
              onSubmitEditing={() => this.onTextInputSubmit()}/>
        </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default ChatRoom
