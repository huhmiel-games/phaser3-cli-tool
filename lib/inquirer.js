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
    askFile: async (fileType) => {
        return inquirer.prompt([
            {
                root: './src',
                type: 'file-tree-selection',
                name: 'file',
                message: 'Press up and down to navigate, right to enter a folder, enter to select a file',
                multiple: false,
                //onlyShowValid: true,
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
            console.log(JSON.stringify(answers))
        });
    },
    askDirectory: async () => {
        return inquirer.prompt([
            {
                root: '.',
                type: 'file-tree-selection',
                name: 'directory',
                message: 'choose directory (press up and down to navigate, right to enter a folder, enter to select a folder)',
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
            //console.log(JSON.stringify(answers))
            return answers;
        });
    },
    askTask: () => {
        const atlasUrl = [
            {
                name: 'task',
                type: 'list',
                message: 'What do you want to do?',
                choices: ['create a platformer', 'add an atlas', 'add a tiled map', 'update the tiled world', 'exit'],
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
            //console.log(JSON.stringify(answers));
            return answers;
        });
    }
};

async function isDirectory(path) {
    return new Promise((resolve) => {
      fs.lstat(path,
        (err, stat) => {
          if (!err) {
            resolve(stat.isDirectory());
          } else {
            resolve(false);
          }
        });
    });
  }