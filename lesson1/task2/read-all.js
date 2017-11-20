const fs = require('fs');
const conf = { encoding: 'utf8'};

module.exports = (path) => {
    const readData = (pathName) => {
        return new Promise ((done, error) => {
            fs.readdir(pathName, (err, files) => {
                done(files);
            });
        });
    };

    const getText = (file) => {
        return new Promise((done, error) => {
            fs.readFile(file, conf, (err, data) => {
                done({name: file, content: data});
            });
        });
    };

    return readData(path)
           .then(files => Promise.all(files.map((fileName) => {
               return getText(`${path}${fileName}`)
                      .then(content => content)
                      .catch(err2 => console.error(err2));
    })))
    .catch(err3 => console.error(err3));
};