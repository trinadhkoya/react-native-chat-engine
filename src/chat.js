import React from 'react';
import {
    Button,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {Icon} from 'react-native-elements';
import {MessageList} from 'chat-engine-react-native';

const TypingIndicator = require('chat-engine-typing-indicator');
const {width} = Dimensions.get('window');
const MAXIMUM_NAMES_IN_TYPING_INDICATOR = 2;

export default class ChatScreen extends React.Component {
    /**
     * React navigation screen navigation item configuration.
     * @param {Object} navigation - Reference on object which contain information passed by stack
     *     controller during transition to this screen.
     * @param {Object} screenProps - Reference on object which contain information which passed
     *     globally to all screens displayed by stack controller.
     *
     * @return {Object} Reference on object which contain navigation item properties.
     * @private
     */
    static navigationOptions = ({navigation, screenProps}) => {
        const chatChannelComponents = navigation.state.params.chat.channel.split('#');
        return {
            title: chatChannelComponents[chatChannelComponents.length - 1],
            headerRight: <Button
                color={screenProps.tintColor}
                title={'Invite'}
                onPress={() => navigation.navigate('InviteUser', {chat: navigation.state.params.chat})}/>
        };
    };

    /**
     * Chat screen constructor.
     *
     * @param {Object} properties - Reference on data which has been passed during screen
     *     instantiation.
     */
    constructor(properties) {
        super(properties);
        this.chat = this.props.navigation.state.params.chat;
        this.me = this.props.screenProps.chatEngine.me;
        this.state = {whoIsTyping: [], chatInput: ''};
    }

    /**
     * Handle screen rendering completion and displaying to the user.
     */
    componentDidMount() {
        if (!this.chat.connected) {
            this.chat.connect();
        }
        this.chat.plugin(TypingIndicator({timeout: 3000}));
        this.chat.on('$typingIndicator.startTyping', this.handleUserStartTyping.bind(this));
        this.chat.on('$typingIndicator.stopTyping', this.handleUserStopTyping.bind(this));
    }

    /**
     * Handle screen rendering stop and view unload.
     */
    componentWillUnmount() {
        this.chat.off('$typingIndicator.startTyping', this.handleUserStartTyping);
        this.chat.off('$typingIndicator.stopTyping', this.handleUserStopTyping);
    }

    /**
     * Render chat screen using React JSX.
     *
     * @return {XML} Screen representation using React JSX syntax.
     */
    render() {
        return (
            <View style={styles().container}>
                {this.chat.connected ? <View style={styles().chatContainer}>
                        <MessageList chat={this.chat} me={this.me}/>
                    </View> :
                    <View/>
                }
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}>
                    <View style={styles(this.state.whoIsTyping.length > 0).typingIndicator}>
                        <Text style={styles().typingIndicatorLabel}>{this.typingIndicatorText()}</Text>
                    </View>
                    <View style={styles().chatFooter}>
                        <TextInput
                            value={this.state.chatInput}
                            style={styles().chatInput}
                            underlineColorAndroid="transparent"
                            placeholder="Send Message"
                            returnKeyType={'send'}
                            onChangeText={text => {
                                this.setState({chatInput: text});
                                this.chat.typingIndicator.startTyping();
                            }}
                            onSubmitEditing={() => this.onTextInputSubmit()}/>
                        <TouchableOpacity style={{backgroundColor: '#D02129'}}>
                            <Icon
                                reverse
                                name="send"
                                size={26}
                                color="#D02129"
                                style={styles().chatSend}
                                onPress={() => {
                                    this.onSendTap();
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        )
    }

    /**
     * Handle user tap on software's keyboard 'Send' button.
     * @private
     */
    onTextInputSubmit() {
        if (!this.state.inviteDisabled) {
            this.onSendTap(false);
        } else if (this.chat.typingIndicator.isTyping) {
            this.chat.typingIndicator.stopTyping();
        }
    }

    /**
     * Handle user tap on send button.
     *
     * @param {Boolean} dismissKeyboard - Whether software keyboard should be explicitly closed or
     *     not.
     * @private
     */
    onSendTap(dismissKeyboard = true) {
        if (dismissKeyboard) {
            Keyboard.dismiss();
        }
        if (this.state.chatInput) {
            console.log('SEND MESSAGE');
            this.chat.emit('message', {
                text: this.state.chatInput
            });
            this.setState({chatInput: ''});
        }
        if (this.chat.typingIndicator.isTyping) {
            this.chat.typingIndicator.stopTyping();
        }
    }

    /**
     * Handle remote user start typing event.
     * @param {Object} payload - Reference on object which contain event information.
     * @param {Object} payload.sender - Reference on remote user information object.
     * @param {String} payload.sender.uuid - Reference on unique remote user identifier.
     * @private
     */
    handleUserStartTyping(payload) {
        if (!this.state.whoIsTyping.includes(payload.sender.uuid) && payload.sender.uuid !== this.me.uuid) {
            this.setState({whoIsTyping: [...this.state.whoIsTyping, payload.sender.uuid]});
        }
    }

    /**
     * Handle remote user stop typing event.
     * @param {Object} payload - Reference on object which contain event information.
     * @param {Object} payload.sender - Reference on remote user information object.
     * @param {String} payload.sender.uuid - Reference on unique remote user identifier.
     * @private
     */
    handleUserStopTyping(payload) {
        if (this.state.whoIsTyping.includes(payload.sender.uuid) && payload.sender.uuid !== this.me.uuid) {
            this.setState({
                whoIsTyping: this.state.whoIsTyping.filter(uuid =>
                    uuid !== payload.sender.uuid)
            });
        }
    }

    /**
     * Compose text for remote user typing indication.
     * @return {string} Pre-formatted string for indicator.
     * @private
     */
    typingIndicatorText() {
        let namesToShow = [];
        this.state.whoIsTyping.forEach((name) => {
            if (namesToShow.length < MAXIMUM_NAMES_IN_TYPING_INDICATOR) {
                namesToShow.push(name);
            }
        });
        const count = this.state.whoIsTyping.length - namesToShow.length;

        return `${namesToShow.join(', ')}${count > 0 ? ' and ' + count + ' more ' : ''} is typing...`
    }
}


/**
 * Screen layout CSS.
 */
const styles = (typingIndicatorVisible = false) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dbdbdb',
        justifyContent: 'center',
        alignItems: 'stretch',
        marginTop: Platform.OS === 'ios' ? -64 : 0
    },
    chatContainer: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 64 : 0
    },
    chatFooter: {
        flexDirection: 'row',
        backgroundColor: '#eee',
    },
    chatInput: {
        paddingHorizontal: 20,
        fontSize: 18,
        flex: 1,
    },
    chatSend: {
        alignSelf: 'center',
        padding: 10,
    },
    typingIndicator: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        opacity: 0.7,
        justifyContent: 'center',
        alignItems: 'stretch',
        left: 0,
        width: width,
        height: typingIndicatorVisible ? 18 : 0
    },
    typingIndicatorLabel: {
        flex: 1,
        fontSize: 16,
        color: '#666666'
    }
});
