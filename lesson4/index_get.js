const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const key = 'trnsl.1.1.20160723T183155Z.f2a3339517e26a3c.d86d2dc91f2e374351379bb3fe371985273278df';

http.createServer((req, res) => {
  if (req.url.startsWith('/translate')) {
    const process = (json) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');

      res.end(json, 'utf8');
    };
    const handler = (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => process(data));
    };

    const txt = encodeURIComponent(querystring.parse(req.url, '?').str);
    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${txt}&lang=ru-en`;
    const request = https.request(url);
    request.on('response', handler);
    request.end();
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const stream = fs.createReadStream(path.resolve('home.html'));
    stream.pipe(res);
  }
}).listen(3000, () => process.stdout.write('Server is running...'));
