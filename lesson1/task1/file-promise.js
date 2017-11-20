const fs = require('fs');
const conf = { encoding: 'utf8'};

exports.read = (file) => {
    return new Promise((done, fail) => {
        fs.readFile(file, conf, (err, content) => {
            if (err) {
                fail(err);
            } else {
                done(content);
            }
        });
    });
};

exports.write = (file, data) => {
    return new Promise ((done, fail) => {
        fs.writeFile(file, data, conf, (err) => {
            if (err) {
                fail(err);
            } else {
                done(file);
            }
        })
    })
};