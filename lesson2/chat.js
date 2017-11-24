const EventEmitter = require('events');

class ChatApp extends EventEmitter {
  /**
   * @param {String} title
   */
  constructor(title) {
    super();

    this.title = title;

    // Посылать каждую секунду сообщение
    setInterval(() => {
      this.emit('message', `${this.title}: ping-pong`);
  }, 1000);
  }
  
  close() {
    this.emit('close');
  }
}

let chatOnMessage = (message) => {
  console.log(message);
};

const waitingToAnswer = () => {
  console.log('Готовлюсь к ответу');
};

const vkClose = () => {
  console.log('Чат вконтакте закрылся :(');
};

const startChat = (chatName, chatTitle) => {
  const config = require(`./${chatName}`)();
  let currentName = chatName;
  chatName = new ChatApp(chatTitle);

  if (config.vkClose) {
    chatName.on(config.vkClose, vkClose);
  }
  if (config.chatOnMessage) {
    chatName.on(config.chatOnMessage, chatOnMessage);
    setTimeout( () => {
      chatName.removeListener(config.chatOnMessage, chatOnMessage);
      if (chatName.listenerCount(config.chatOnMessage) === 0) {
        console.log(config.timeoutMess);
        chatName.close();
      }
    }, config.time);
  }
  if (config.waitingToAnswer) {
    chatName.on(config.waitingToAnswer, waitingToAnswer);
    setTimeout( () => {
      chatName.removeListener(config.waitingToAnswer, waitingToAnswer);
      if (chatName.listenerCount(config.waitingToAnswer) === 0) {
        console.log(config.timeoutMess);
        chatName.close();
      }
    }, config.time);
  }
}

module.exports = {startChat};