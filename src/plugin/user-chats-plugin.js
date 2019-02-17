class UserChatsPlugin {

  /**
   * User chats tracking plugin.
   *
   * @param {Object} configuration - Reference on object which contain data required for plugin to
   *     work.
   * @param {function(chat: Chat)} configuration.callback - Reference on chat discovery callback
   *     function.
   * @param {String[]} configuration.ignoredChats - Reference on list of chats for which
   *     _callback_ should not be called.
   */
  constructor(configuration) {
    this.callback = configuration.callback;
    this.ignoredChats = configuration.ignoredChats;
  }

  construct() {
    if (!this.isIgnoredChat(this.parent)) {
      this.callback(this.parent);
    }
  }

  /**
   * Check whether passed {@link Chat} belong to one of which should be excluded from public user
   * chats list.
   *
   * @param {Chat} chat - Reference on chat which should be examined.
   * @return {boolean} _true_ in case if chat represent non-public chat instances or one from
   *     debug server (Main, Support, Docs and Foolery).
   */
  isIgnoredChat(chat) {
    return !this.ChatEngine.global || this.ignoredChats.filter(chatName =>
        chat.channel.endsWith(chatName)).length > 0;
  }
}

module.exports = (configuration) => {
  return {
    namespace: 'chat-demo.user-chats',
    extends: {
      Chat: class Wrapper { constructor() { return new UserChatsPlugin(configuration); } }
    }
  }
};
