const chalk = require('chalk');
const fs = require('fs');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files');
const inquirer = require('./lib/inquirer');

module.exports = () => {
    clear();

    console.log(
        chalk.yellow(
            figlet.textSync('p3ct', {font: 'Speed', horizontalLayout: 'full'})
        )
    );

    //console.log('current directory: ', files.getCurrentDirectoryBase())

    const run = async () => {
        const result = await inquirer.askAtlasUrl();

        console.log(files.fileExists(result.atlas))
    };

    const askFile = async () => {
        return await inquirer.askFile();
        const data = await result
        console.log(data)
    }

    const askDirectory = async () => {
        const result = await inquirer.askDirectory();
        console.log('RESULT: ', result)
    }

    const selectAtlas = async () => {
        const atlas = require('./lib/atlas.js');
        console.log(chalk.blue('Select the atlas json file'));
        return await inquirer.askFile().then((value) => {
            return value;
        });
    }

    const selectScene = async () => {
        const atlas = require('./lib/atlas.js');
        console.log(chalk.blue('Select the scene file'));
        return await inquirer.askFile().then((value) => {
            return value;
        });
    }

    const addAtlasToScene = async (atlasUrl, sceneUrl) => {
        try {
            const atlas = require('./lib/atlas.js');
            const loadingSceneWithImport = await atlas.addImport(atlasUrl, sceneUrl);
            const loadingSceneWithPreload = await atlas.addPreLoader(loadingSceneWithImport, atlasUrl);
            const loadingSceneWithAnims = await atlas.addAnims(loadingSceneWithPreload, atlasUrl);
            fs.writeFileSync(sceneUrl, loadingSceneWithAnims);
            console.log(chalk.green('Done'));
        } catch(error) {
            console.log(chalk.red('Oops something wrong happened...'))
        }
    }

    const askTask = async () => {
        const result = await inquirer.askTask();
        // console.log('TASK: ', result)

        switch(result.task) {
            case 'create a platformer':
                const git = require('simple-git')();
                try {
                    git.clone('https://github.com/huhmiel-games/phaser3-platformer-template.git .')
                } catch (error) {
                    console.log(chalk.red(error))
                }
                
                // if (files.directoryExists('.git')) {
                //     console.log(chalk.red('Already a Git repository!'));
                //     process.exit(1);
                // }
                //askTask();
                break;
            case 'add an atlas':
                const atlasFile = await selectAtlas();
                const sceneFile = await selectScene();
                await addAtlasToScene(atlasFile, sceneFile);
                askTask();
                break;
            
            case 'exit':
                process.exit(0);
        }
    }

    // start script

    askTask();
}
