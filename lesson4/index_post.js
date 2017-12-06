const http = require('http');
const https = require('https');
const fs = require('fs');
const querystring = require('querystring');
const path = require('path');

const PORT = process.env.PORT || 3000;

const key = 'trnsl.1.1.20160723T183155Z.f2a3339517e26a3c.d86d2dc91f2e374351379bb3fe371985273278df';

const handler = (req, res) => {
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const stream = fs.createReadStream(path.resolve('home.html'));
    stream.pipe(res);
  } else if (req.url.startsWith('/translate')) {
    let body = '';
    req.on('data', (data) => {
      body += data;
    });
    req.on('end', () => {
      const txt = encodeURIComponent(querystring.parse(body).str);
      const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${txt}&lang=ru-en`;
      const request = https.request(url);
      request.on('response', (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');

          res.end(data, 'utf8');
        });
      });
      request.end();
    });
  }
};

const server = http.createServer();
server
  .listen(PORT)
  .on('error', err => console.error(err))
  .on('request', handler)
  .on('listening', () => process.stdout.write('Server is running...'));
