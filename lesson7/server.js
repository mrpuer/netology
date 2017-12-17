const app = require('express')();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});
let usersCount = 0;
io.on('connection', (socket) => {
  // при событии нового юзера, берем его имя и отправляем клиентам уведомление
  socket.on('new user', (username) => {
    usersCount += 1;
    socket.username = username;
    socket.broadcast.emit('join', { username:  socket.username });
    socket.emit('join count', { count: usersCount });
  });
  // при событии нового сообщения, рассылаем ему всему сокету
  socket.on('chat message', (msg) => {
    io.emit('add message', { username: socket.username, message: msg });
  });
  // юзер ушел, добавляем событие
  socket.on('disconnect', () => {
    usersCount -= 1;
    socket.broadcast.emit('bye', { username: socket.username, count: usersCount });
  });
});

http.listen(3000, () => console.log('Server running...'));
