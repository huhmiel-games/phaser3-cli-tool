const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Phaser3-cli-tool', { font: 'Speed', horizontalLayout: 'full' })
  )
);

console.log(files.getCurrentDirectoryBase())