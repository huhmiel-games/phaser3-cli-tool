const minimist = require('minimist');
const prompt = require('prompt');
const colors = require("colors/safe");
const path = require('path');

function onErr(err) {
    console.log(err);
    return 1;
}

module.exports = () => {
    const args = minimist(process.argv.slice(2));
    let cmd = args._[0] || 'help';

    if(args.version || args.v) {
        cmd = 'version';
    }

    if(args.help || args.h) {
        cmd = 'help';
    }

    switch(cmd) {
        case 'addAtlas':
            if(args._.length === 1) {
                prompt.start();
                prompt.get({
                    properties: {
                        atlas: {
                            description: colors.green(`
Enter the atlas file url without extension, 
ex : ./src/assets/playerAtlas
`)
                        }
                    }
                }, function(err, result) {
                    if(err) {
                        return onErr(err);
                    }
                    try {
                        if(!path.existsSync(`${result.atlas}.json`)) {
                            console.log('\x1b[33m%s\x1b[0m','File not found');
                            process.exit(1);
                        }
                    } catch(error) {
                        console.log('\x1b[33m%s\x1b[0m','File not found');
                        process.exit(1);
                    }
                    console.log('  Atlas file: ' + result.atlas);

                    if(result.atlas) {
                        require('./cmds/addAtlas')(result.atlas);
                    }
                });
            }
            else {
                require('./cmds/addAtlas')(args);
            }
            break;

        case 'addTiledMaps':
            require('./cmds/addTiledMaps')(args);
            break;

        case '-v':
        case 'version':
            require('./cmds/version')(args);
            break;

        case '-h':
        case 'help':
            require('./cmds/help')(args);
            break;

        default:
            console.error(`"${cmd}" is not a valid command!`);
            break;
    }
}