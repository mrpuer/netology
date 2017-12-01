const fs = require('fs');
const conf = { encoding: 'utf8'};

const readData = (pathName) => {
    return new Promise ((done, error) => {
        fs.readdir(pathName, (err, files) => {
            if (err) {
                error(err);
            }
            done(files);
        });
    });
};

const getText = (file) => {
    return new Promise((done, error) => {
        fs.readFile(file, conf, (err, data) => {
            if (err) {
                error(err);
            }
            done({name: file, content: data});
        });
    });
};

module.exports = (path) => {
    return readData(path)
           .then(files => Promise.all(files.map((fileName) => {
               return getText(`${path}${fileName}`)
    })));
};