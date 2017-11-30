const Transform = require('stream').Transform;
const fs = require('fs');
const crypto = require('crypto');
const hash = crypto.createHash('MD5');

const input = fs.createReadStream('input.txt');
const output = fs.createWriteStream('output.txt');

class CTransform extends Transform {
    constructor (options) {
        super(options);
        this.store = '';
    }

    _transform(chunk, encoding, next) {
        hash.update(chunk);
        next();
    }

    _flush(done) {
        this.store += hash.digest('hex');
        console.log(this.store);
        output.write(this.store);
        output.end;
        done();
    }
}

const st = new CTransform();

input.pipe(st).pipe(output);