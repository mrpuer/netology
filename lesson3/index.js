const fs = require('fs');
const crypto = require('crypto');
const hash = crypto.createHash('MD5');

const readData = fs.createReadStream('input.txt');
const writeData = fs.createWriteStream('output.txt');

readData.on('data', (chunk) => {
    hash.update(chunk, 'utf8');
});

readData.on('end', () => {
    let resultHash = hash.digest('hex');
    console.log(resultHash);
});

readData.pipe(writeData);