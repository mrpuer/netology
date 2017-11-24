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

let webinarChat =  new ChatApp('webinar');
let facebookChat = new ChatApp('=========facebook');
let vkChat =       new ChatApp('---------vk');

let chatOnMessage = (message) => {
  console.log(message);
};

const waitingToAnswer = () => {
  console.log('Готовлюсь к ответу');
};

const vkClose = () => {
  console.log('Чат вконтакте закрылся :(');
};

webinarChat.on('message', chatOnMessage);
webinarChat.on('message', waitingToAnswer);

facebookChat.on('message', chatOnMessage);
vkChat.setMaxListeners(2);
vkChat.on('message', chatOnMessage);
vkChat.on('message', waitingToAnswer);
vkChat.on('close', vkClose);

setTimeout( ()=> {
  console.log('Закрываю вконтакте...');
vkChat.removeAllListeners('message', chatOnMessage);
vkChat.close();
}, 5000 );


setTimeout( ()=> {
  console.log('Закрываю фейсбук, все внимание — вебинару!');
facebookChat.removeListener('message', chatOnMessage);
}, 10000 );

setTimeout( ()=> {
  console.log('Закрыть вебинар');
webinarChat.removeAllListeners('message', chatOnMessage);
}, 15000 );