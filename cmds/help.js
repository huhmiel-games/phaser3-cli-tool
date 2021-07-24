const COLORS = require('../constant/colors.js');

const menus = {
    main: `     Usage:

      phaser3-cli-tool [command] <options>
  
      addAtlas .............. automate the import, the preload and the creation of animations, of an atlas
      addTiledMaps .............. automate the import and the preload of a folder containing tiles maps
      version ............ show package version
      help ............... show help menu for a command`,

    today: `
      outside today <options>
  
      --location, -l ..... the location to use`,

    addAtlas: `
      phaser3-cli-tool add-atlas <atlas file url without extension>
    `
}

module.exports = (args) => {
    const subCmd = args._[0] === 'help'
        ? args._[1]
        : args._[0]

    console.log("\x1b[36m", `
      ####################################################
      #  _     _  __ __ _ __     __   ___   ___ _  _     #
      # |_)|_||_|(_ |_ |_)__)   /  |   |     | / \\/ \\|   #
      # |  | || |__)|__| \\__)   \\__|___|_    | \\_/\\_/|__ #
      #                                                  #
      ####################################################
`)
    console.log("\x1b[0m", menus[subCmd] || menus.main)
}