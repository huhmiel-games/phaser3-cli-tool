const fs = require('fs');
const path = require('path');

module.exports = {
    getCurrentDirectoryBase: () => {
        return path.basename(process.cwd());
    },

    directoryExists: (filePath) => {
        return fs.existsSync(filePath);
    },

    fileExists: (filePath) => {
        return fs.existsSync(filePath);
    },

    getFile: (filename) => {
        var data = fs.readFileSync(filename, "utf8");
        return data;
    }
};
