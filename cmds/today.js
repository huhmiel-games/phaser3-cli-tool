const ora = require('ora');

module.exports = (args) => {
    const spinner = ora().start()
    setTimeout(() => {
        console.log('today is sunny');
        spinner.stop();
    }, 1200);
    
}