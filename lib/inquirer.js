const fs = require('fs');
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

module.exports = {
    askAtlasUrl: () => {
        const atlasUrl = [
            {
                name: 'atlas',
                type: 'input',
                message: 'Enter the atlas file url without extension:',
                validate: function(value) {
                    if(value.length) {
                        return true;
                    } else {
                        return 'Please enter the atlas file url without extension:';
                    }
                }
            }
        ];
        return inquirer.prompt(atlasUrl);
    },
    askConfirm: (question) => {
        const confirm = {
            name: 'confirm',
            type: 'confirm',
            message: chalk.yellow(question),
            validate: function(value) {
                if(value.length) {
                    return true;
                } else {
                    return 'Please '+ question;
                }
            }
        }
    },
    askFile: async (question) => {
        return inquirer.prompt([
            {
                root: './src',
                type: 'file-tree-selection',
                name: 'file',
                message: chalk.yellow(question),
                multiple: false,
                validate: async (input) => {
                    return path.extname(input) !== '' || !await isDirectory(input);
                },
                transformer: (input) => {
                    const name = input.split(path.sep).pop();
                    if(name[0] == ".") {
                        return chalk.grey(name);
                    }
                    return name;
                }
            }
        ]).then(answers => {
            return answers.file;
        });
    },
    askDirectory: async (question, root = '.') => {
        return inquirer.prompt([
            {
                root: root,
                type: 'file-tree-selection',
                name: 'directory',
                message: chalk.yellow(question),
                multiple: false,
                onlyShowValid: true,
                validate: async (input) => {
                    return await isDirectory(input);
                },
                transformer: (input) => {
                    const name = input.split(path.sep).pop();
                    if(name[0] == ".") {
                        return chalk.grey(name);
                    }
                    return name;
                }
            }
        ]).then(answers => {
            return answers.directory;
        });
    },
    askTask: () => {
        const atlasUrl = [
            {
                name: 'task',
                type: 'list',
                message: chalk.yellow('What do you want to do?'),
                choices: ['add an atlas', 'add a tiled maps', 'update the tiled world', 'exit'],
                validate: function(value) {
                    if(value.length) {
                        return true;
                    } else {
                        return 'Please enter the atlas file url without extension:';
                    }
                }
            }
        ];
        return inquirer.prompt(atlasUrl).then(answers => {
            return answers;
        });
    }
};

async function isDirectory(path) {
    return new Promise((resolve) => {
        fs.lstat(path, (err, stat) => {
            if(!err) {
                resolve(stat.isDirectory());
            } else {
                resolve(false);
            }
        });
    });
}