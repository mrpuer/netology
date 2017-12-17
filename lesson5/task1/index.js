const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const restAPI = express.Router();
const rpcAPI = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(`${__dirname}/pub`));

let users = [];

restAPI.post('/users/', (req, res) => {
  const id = users.length;
  users.push(req.body);
  res.send(`Пользователь ${req.body.name} добавлен с ID ${id}`);
});

restAPI.get('/users/', (req, res) => {
  res.json(users);
});

restAPI.get('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (user) {
    res.json(users[req.params.id]);
  } else {
    res.status(404);
    res.send('Пользователь не найден');
  }
});

restAPI.delete('/users/:id', (req, res) => {
  users[req.params.id] = undefined;
  res.json(`Пользователь с ID ${req.params.id} удален.`);
});

restAPI.put('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (user) {
    users[req.params.id] = Object.assign({}, user, req.body);
    res.send('Пользователь изменен');
  } else {
    res.status(404);
    res.send('Пользователь не найден');
  }
});

rpcAPI.post('/users/', (req, res) => {
  const response = { jsonrpc: req.body.jsonrpc, id: req.body.id };
  const { method } = req.body.method;

  switch (method) {
    case 'add':
      if (req.body.params.name && req.body.params.score) {
        users.push(req.body.params);
        response.result = 'Пользователь успешно добавлен.';
      } else {
        response.result = 'Параметры указаны не верно.';
      }
      break;
    case 'view':
      if (users.length === 0) {
        response.result = 'Пользователей не найдено';
      } else {
        response.result = users;
      }
      break;
    case 'delete':
      users = users.filter(user => user.name !== req.body.params.name);
      res.result = 'Пользователь удален.';
      break;
    case 'update':
      users = Object.assign({}, user, req.body);
      res.result = 'Пользователь изменен';
      break;
    default:
      response.result = 'Метод не найден';
      res.status(404);
      res.send('Команда не найдена!');
  }

  res.json(response);
});

app.use('/api/rest/v1/', restAPI);
app.use('/api/rpc/v1/', rpcAPI);
app.listen(3000, () => process.stdout.write('Server is running...\n'));
