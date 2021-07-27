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

    const selectAtlas = async () => {
        const atlas = require('./lib/atlas.js');
        return await inquirer.askFile('Select the atlas json file').then((value) => {
            return value;
        });
    }

    const selectScene = async () => {
        const atlas = require('./lib/atlas.js');
        return await inquirer.askFile('Select the scene file').then((value) => {
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
            console.log(chalk.red('Oops something wrong happened...', error))
        }
    }

    const askTask = async () => {
        const result = await inquirer.askTask();

        switch(result.task) {
            case 'create a platformer':
                const git = require('simple-git')();
                const dir = await inquirer.askDirectory('Select an empty directory for your project', require('os').homedir());
                if (files.directoryExists(dir+'/.git')) {
                    console.log(chalk.red('Already a Git repository!'));
                    process.exit(1);
                }

                try {
                    console.log(chalk.underline(dir))
                    // git.clone(`https://github.com/huhmiel-games/phaser3-platformer-template.git ${dir}`)
                } catch (error) {
                    console.log(chalk.red(error))
                }
                
                
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
