import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import sha1 from "sha1";


let stateObj = {};

export default class AuthLoading extends React.Component {
  /**
   * React navigation screen navigation item configuration.
   * @param {Object} navigation - Reference on object which contain information passed by stack
   *     controller during transition to this screen.
   * @param {Object} screenProps - Reference on object which contain information which passed
   *     globally to all screens displayed by stack controller.
   * @return {Object} Reference on object which contain navigation item properties.
   * @private
   */
  static navigationOptions = ({navigation}) => {
    return {title: 'Authorize'}
  };

  /**
   * Authorization screen constructor.
   *
   * @param {Object} properties - Reference on data which has been passed during screen
   *     instantiation.
   */
  constructor(properties) {
    super(properties);
    this.state = {UUID: '', name: '', email: "", phone: "", nameEditable: true, loginDisabled: true};
  }

  /**
   * Render authorization screen using React JSX.
   *
   * @return {XML} Screen representation using React JSX syntax.
   */
  render() {
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.chatInfoContainer}>
            <TextInput
                style={styles.input}
                value={this.state.UUID}
                maxLength={80}
                editable={this.state.nameEditable}
                autoCapitalize={'none'}
                autoCorrect={false}
                autoFocus={true}
                placeholder={'enter anyhting unique'}
                returnKeyType={'go'}
                onChangeText={(text) => {
                  this.setState({UUID: text});
                  this.setState({loginDisabled: this.state.UUID.length < 3});
                }}
                onSubmitEditing={() => this.onTextInputSubmit()}/>

            <TextInput
                style={styles.input}
                value={this.state.name}
                maxLength={80}
                // editable={this.state.nameEditable}
                autoCapitalize={'none'}
                autoCorrect={false}
                autoFocus={true}
                placeholder={'Enter Your name'}
                returnKeyType={'go'}
                onChangeText={(text) => {
                  this.setState({name: text});
                  this.setState({loginDisabled: this.state.name.length < 5});
                }}
                onSubmitEditing={() => this.onTextInputSubmit()}/>


            <TextInput
                style={styles.input}
                value={this.state.email}
                maxLength={80}
                // editable={this.state.nameEditable}
                autoCapitalize={'none'}
                autoCorrect={false}
                autoFocus={true}
                placeholder={'Enter Your email'}
                returnKeyType={'go'}
                onChangeText={(text) => {
                  this.setState({email: text});
                  this.setState({loginDisabled: this.state.email.length < 10});
                }}
                onSubmitEditing={() => this.onTextInputSubmit()}/>


            <TextInput
                style={styles.input}
                value={this.state.phone}
                maxLength={80}
                // editable={this.state.nameEditable}
                autoCapitalize={'none'}
                autoCorrect={false}
                autoFocus={true}
                placeholder={'Enter Your Phone'}
                returnKeyType={'go'}
                onChangeText={(text) => {
                  this.setState({phone: text});
                  this.setState({loginDisabled: this.state.phone.length < 10});
                }}
                onSubmitEditing={() => this.onTextInputSubmit()}/>


            <TouchableHighlight
                style={this.state.loginDisabled ? styles.buttonDisabled : styles.button}
                underlayColor={'#78141c'}
                onPress={this.onLoginTap.bind(this)}
                disabled={this.state.loginDisabled}>
              <Text style={styles.label}>LOGIN</Text>
            </TouchableHighlight>
          </View>
        </KeyboardAvoidingView>
    )
  }

  /**
   * Handle user tap on software's keyboard 'Go' button.
   * @private
   */
  onTextInputSubmit() {
    if (!this.state.inviteDisabled) {
      this.onLoginTap(false);
    }
  }

  /**
   * Handle user tap on login button.
   *
   * @param {Boolean} dismissKeyboard - Whether software keyboard should be explicitly closed or
   *     not.
   * @private
   */
  onLoginTap(dismissKeyboard = true) {

    const {name, email, UUID, phone} = this.state;

    stateObj['name'] = name;
    stateObj['email'] = email;
    stateObj['phone'] = phone;

    if (dismissKeyboard) {
      Keyboard.dismiss();
    }
    this.setState({nameEditable: false, loginDisabled: true});
    const {navigate} = this.props.navigation;
    const ChatEngine = this.props.screenProps.chatEngine;

    ChatEngine.once('$.ready', (payload) => {
      console.log(payload);
      let chat = new ChatEngine.Chat('private-chat',true);
      navigate('ChatRoom',{chat:chat,chatEngine:ChatEngine});
      console.log(ChatEngine.chats);


    });
    ChatEngine.connect(sha1(UUID), stateObj, `${this.state.name}-secret`);
  }
}

/**
 * Screen layout CSS.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#fff',
    marginTop: -64
  },
  chatInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    fontSize: 18,
    width: 250,
    color: '#666666',
    paddingHorizontal: 10,
    height: Platform.OS === 'ios' ? 30 : 40,
    borderColor: '#CE242F',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF'
  },
  button: {
    width: 150,
    backgroundColor: '#CE242F',
    borderColor: '#78141c',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 3 : 6,
    marginTop: 10,
    height: Platform.OS === 'ios' ? 30 : 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonDisabled: {
    width: 150,
    backgroundColor: '#CE242F',
    borderColor: '#78141c',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 3 : 6,
    marginTop: 10,
    height: Platform.OS === 'ios' ? 30 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    width: 120,
    color: '#ffffff',
    alignSelf: 'center',
    textAlign: 'center'
  }
});
