const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const restAPI = express.Router(); //roure for REST API /api/rest/v1/users
const rpcAPI = express.Router(); //roure for RPC API /api/rpc/v1/users
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let users = [{"name":"misha","score":"700"},{"name":"masha","score":"400"},{"name":"petya","score":"100"}];

//добавление
restAPI.post('/users/', (req, res) => {
  if (req.body.name && req.body.score) {
    users.push(req.body);
    res.send(`Пользователь ${req.body.name} добавлен с ID ${users.length - 1}`);
  } else {
    res.status(400);
    res.send('Параметры пользователя указаны не верно.');
  }
});
//просмотр. ограничить: limit=1, сдвиг: offset=1
restAPI.get('/users/', (req, res) => {
  let result = [];
  if (req.query.fields) {
    const fieldsArr = req.query.fields.split(',');
    users.forEach((user, index) => {
      const resultUser = {};
      fieldsArr.forEach((field) => {
        resultUser[field] = users[index][field];
      });
      result.push(resultUser);
    });
  } else {
    result = users.slice();
  }
  if (users.length === 0) {
    res.send('Нет пользователей для отображения');
  }
  if (req.query.offset) {
    result.splice(0, req.query.offset);
  }
  if (req.query.limit) {
    result.splice(req.query.limit);
  }
  res.json(result);
});
//просмотр одного
restAPI.get('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (user) {
    res.json(users[req.params.id]);
  } else {
    res.status(404);
    res.send('Пользователь с таким ID не найден');
  }
});
//удаление. удалить всех: ...users/all
restAPI.delete('/users/:id', (req, res) => {
  if (req.params.id === 'all') {
    users = [];
    res.json('База Очищена');
  }
  else if (!users[req.params.id]) {
    res.status(404);
    res.send('Пользователь с таким ID не найден');
  }
  else {
    users.splice(req.params.id, 1);
    res.json(`Пользователь с ID ${req.params.id} удален.`);
  }
});
//редактирование. переместить в конец: offset = 1
restAPI.put('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (req.body.offset) {
    users.splice(req.params.id, 1);
    users.push(user);
    res.send('Пользователь перемещен');
  }
  else if (user && (req.body.name || req.body.score)) {
    users[req.params.id] = Object.assign({}, user, req.body);
    res.send('Пользователь изменен');
  } else {
    res.status(404);
    res.send('Пользователь с таким ID не найден или неверно указаны параметры для редактирования');
  }
});

rpcAPI.post('/users/', (req, res) => {
  const response = { jsonrpc: req.body.jsonrpc };
  const method = req.body.method;
  switch (method) {
    case 'add': //request: {jsonrpc: '1.0', method: 'add', params: {name: 'Newuser', score: 100}}
      if (req.body.params.name && req.body.params.score) {
        users.push(req.body.params);
        response.result = `Пользователь успешно добавлен. ID ${users.length - 1}`;
      } else {
        res.status(400);
        response.result = 'Параметры пользователя указаны не верно.';
      }
      break;
    case 'view': //request: {jsonrpc: '1.0', method: 'view'}
      if (users.length === 0) {
        res.status(404);
        response.result = 'Нет пользователей для отображения';
      } else {
        response.result = users;
      }
      break;
    case 'viewUser':
      if (!users[req.body.id]) {
        res.status(404);
        response.result = 'Пользователь не найден';
      } else {
        response.result = users[req.body.id];
      }
      break;
    case 'delete': //request: {jsonrpc: '1.0', method: 'delete', id: 1}
      if (!users[req.body.id]) {
        res.status(404);
        response.result = 'Пользователь не найден';
      } else {
        users.splice(req.body.id, 1);
        response.result = 'Пользователь удален.';
      }
      break;
    case 'update': //request: {jsonrpc: '1.0', method: 'update', params: {name: 'Newuser', score: 100}, id: 1}      
      if (users[req.body.id] && req.body.params.name && req.body.params.score) {
        users[req.body.id] = req.body.params;
        response.result = 'Пользователь изменен'
      } else {
        res.status(404);
        response.result = 'Пользователь с таким ID не найден или неверно указаны параметры для редактирования';
      }
      break;
    default:
      response.result = 'Команда не найдена!';
      res.status(400);
      res.send('Команда не найдена!');
  }
  res.json(response);
});

app.use('/api/rest/v1/', restAPI);
app.use('/api/rpc/v1/', rpcAPI);
app.listen(3000, () => process.stdout.write('Server is running...\n'));
