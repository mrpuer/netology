const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, Express.js');
});

app.get('/hello/', (req, res) => {
  res.send('Hello stranger!');
});

app.get('/hello/:name', (req, res) => {
  res.send(`Hello ${req.params.name}!`);
});

app.all('/sub/*', (req, res) => {
  res.send(`You requested URI: ${req.originalUrl}`);
});

const checkHeader = (req, res, next) => {
  if (req.get('Header')) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.post('/post/', checkHeader, (req, res) => {
  if ((Object.keys(req.body).length === 0)) {
    res.sendStatus(404);
  } else {
    res.json(req.body);
  }
});

app.listen(3000, () => console.log('Server is running...'));

