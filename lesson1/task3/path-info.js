const fs = require('fs');
const conf = { encoding: 'utf8'};

module.exports = (path, callback) => {
    fs.stat(path, (error, stats) => {
        if (error) return callback(error);
        if (stats.isFile()) {
            fs.readFile(path, conf, (err, data) => {
                callback(err, { path,
                                type: 'file',
                                content: data,
                                childs: undefined                            
                               });
            });
        }
        if (stats.isDirectory()) {
            fs.readdir(path, (err, files) => {
                callback(err, { path,
                                type: 'directory',
                                content: undefined,
                                childs: files                            
                               });
            });
        }
    });
};