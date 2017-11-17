const fs = require('fs');
const conf = { encoding: 'utf8'};

exports.read = (file) => {
    return new Promise((done) => {
        fs.readFile(file, conf, (err, content) => {
            done(content);
        });
    });
};

exports.write = (file, data) => {
    return new Promise ((done) => {
            fs.writeFile(file, data, () => {
            done(file); 
        })
    })
};