const fs = require("fs");
const path = require('path');
const regex = require('./regex.js');
const files = require('./files.js');
const inquirer = require('./inquirer.js');
const chalk = require('chalk');

let config = {
    sceneUrl: './src/scenes/LoadingScene.ts', // You must adapt this line to your project
    addImport: true, // false to ignore imports lines
    imageType: 'png', // just in case someone use another type of images
    frameRateCoeff: 2, // animation frameRate = numbers of frames * frameRateCoeff
}

module.exports = {
    addImport: (atlasUrl, sceneUrl) => {
        const srcIndex = atlasUrl.split('/').findIndex(e => e === 'src');
        const relativeUrl = atlasUrl.split('/').slice(srcIndex).join('/');
        const dirName = path.dirname(relativeUrl);

        const loadingSceneFile = files.getFile(sceneUrl);
        const ext = path.extname(atlasUrl);
        const fileName = path.basename(atlasUrl, ext);

        const newLoadingScene = loadingSceneFile.replace(regex.importSection, `// IMPORT ATLAS //
        import ${fileName}JSON from './${dirName}/${fileName}.json';
        import ${fileName} from './${dirName}/${fileName}.${config.imageType}';`);

        return newLoadingScene;
    },
    addPreLoader: (loadingSceneWithImport, atlasUrl) => {
        const srcIndex = atlasUrl.split('/').findIndex(e => e === 'src');
        const relativeUrl = atlasUrl.split('/').slice(srcIndex).join('/');
        const ext = path.extname(atlasUrl);
        const fileName = path.basename(atlasUrl, ext);

        const newLoadingScene = loadingSceneWithImport.replace(regex.preloadSection, `// PRELOAD ATLAS //
        this.load.atlas('${fileName}', ${fileName}, ${fileName}JSON);`);

        return newLoadingScene;
    },
    addAnims: (loadingSceneWithPreload, atlasUrl) => {
        const atlasFile = files.getFile(atlasUrl);
        const atlasJsonObj = JSON.parse(atlasFile);
        const ext = path.extname(atlasUrl);
        const fileName = path.basename(atlasUrl, ext);

        let framesArray = atlasJsonObj.textures[0].frames;

        framesArray.sort((a, b) => {
            return a.filename - b.filename;
        });

        let currentFrame = '';
        let result = ``;
        let alreadyFilled = [];

        framesArray.forEach(frame => {
            const frameName = frame.filename
            const frameNameTrimmed = frameName.replace(regex.lastNumbers, "");

            if(alreadyFilled.includes(frameNameTrimmed)) {
                return;
            }

            if(frameNameTrimmed !== currentFrame) {
                currentFrame = frameNameTrimmed;
                result += `
                this.anims.create({
                    key: '${frameNameTrimmed.replace(regex.lastSymbols, "")}',
                    frames: [
                `
            }
            if(frameNameTrimmed === currentFrame) {
                const currentAnim = framesArray.filter(e => e.filename.replace(regex.lastNumbers, "") === frameNameTrimmed);

                currentAnim.forEach(anim => {
                    result += `{key: '${fileName}', frame: '${anim.filename}'},
                    `;
                })

                result += `],
                    frameRate: ${currentAnim.length * config.frameRateCoeff},
                    repeat: -1,
                });
                `
                alreadyFilled.push(frameNameTrimmed)
            }
        });

        const newLoadingSceneWithAnims = loadingSceneWithPreload.replace(regex.animsSection, `// ANIMS ATLAS //
        ${result}`);

        return newLoadingSceneWithAnims;
    }
}
