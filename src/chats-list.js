import React from 'react';
import { TouchableHighlight, StyleSheet, ListView, Button, Image, View, Text } from 'react-native';
const UserChatsPlugin = require('./plugin/user-chats-plugin');

export default class ChatsListScreen extends React.Component {
    /**
     * React navigation screen navigation item configuration.
     * @param {Object} navigation - Reference on object which contain information passed by stack
     *     controller during transition to this screen.
     * @param {Object} screenProps - Reference on object which contain information which passed
     *     globally to all screens displayed by stack controller.
     * @return {Object} Reference on object which contain navigation item properties.
     * @private
     */
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Chats',
        headerLeft: null,
        headerRight: <Button
            color={ screenProps.tintColor }
            title={ 'Create' }
            onPress={ () => navigation.navigate('CreateChat', screenProps) }/>
    });

    /**
     * User chats list screen constructor.
     *
     * @param {Object} properties - Reference on data which has been passed during screen
     *     instantiation.
     */
    constructor(properties) {
        super(properties);
        const dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        this.state = { chatsList: [], dataSource: dataSource.cloneWithRows([]) };
    }

    /**
     * Handle screen rendering completion and displaying to the user.
     */
    componentDidMount() {
        let ignoredChats = ['#read.#feed', '#write.#direct', '#public.#Main', '#public.#Support', '#public.#Docs', '#public.#Foolery'];
        this.props.screenProps.chatEngine.proto('Chat', UserChatsPlugin({
            ignoredChats,
            callback: (chat) => {
                const updatedChatsList = this.state.chatsList.concat(chat);
                this.setState( { chatsList: updatedChatsList }, () => {
                    this.setState({ dataSource: this.state.dataSource.cloneWithRows(this.state.chatsList) })
                })
            }
        }));
    }

    /**
     * Render chats list screen using React JSX.
     *
     * @return {XML} Screen representation using React JSX syntax.
     */
    render() {
        return (
            <View style={ styles.container }>
                {!this.state.chatsList.length ?
                    (<View style={styles.loaderHolder}><Text>No active chats</Text></View>) :
                    (
                        <ListView
                            enableEmptySections={ true }
                            dataSource={ this.state.dataSource }
                            renderRow={ rowData => this.renderedRow(rowData) }
                            onEndReachedThreshold={ 30 } />
                    )
                }
            </View>
        );
    }

    /**
     * Render chat entry layout for list view.
     *
     * @param {Chat} chat - Reference on chat model for which row should be rendered.
     * @return {XML} Rendered chat entry.
     * @private
     */
    renderedRow(chat) {
        return (
            <TouchableHighlight onPress={ () => this.onItemTap(chat) }>
                <View style={ styles.listItemHolder }>
                    <View style={ styles.listItemIconHolder }>
                        <Image
                            style={ styles.chatIcon }
                            source={{
                                uri: 'https://www.pubnub.com/wp-content/themes/pubnub/images/touch-icon/apple-touch-icon-57x57.png'
                            }} />
                    </View>
                    <View style={ styles.listItemInfoHolder }>
                        <Text style={ styles.chatNameLabel }>{ ChatsListScreen.chatNameFromChannel(chat) }</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    /**
     * Handle tap on chat entry from list.
     *
     * @param {Chat} chat - reference on one of chats to which user subscribed at this moment.
     * @private
     */
    onItemTap(chat) {
        const { navigation } = this.props;
        navigation.navigate('Chat', { chat });
    }

    /**
     * Extract chat channel name.
     *
     * @param {Chat} chat - Reference on chat instance for which name should be extracted.
     * @return {String} Chat channel name.
     * @private
     */
    static chatNameFromChannel(chat) {
        let channelComponents = chat.channel.split('.');
        return channelComponents[channelComponents.length - 1].slice(1);
    }
}

/**
 * Screen layout CSS.
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dbdbdb',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    loaderHolder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemHolder: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dbdbdb',
        borderBottomWidth: 0.5,
        borderColor: '#D0DBE4',
        padding: 5
    },
    listItemIconHolder: {
        justifyContent: 'flex-start',
        paddingLeft: 10,
        paddingRight: 15
    },
    chatIcon: {
        width: 30,
        height: 30
    },
    listItemInfoHolder: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    chatNameLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000'
    }
});
