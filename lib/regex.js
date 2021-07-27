module.exports = {
    importSection: /(?:\/\/ IMPORT SECTION \/\/)/,
    preloadSection: /(?:\/\/ PRELOAD SECTION \/\/)/,
    animsSection: /(?:\/\/ ANIMS SECTION \/\/)/,
    lastNumbers: /([0-9]+)$/,
    lastSymbols: /([^a-zA-Z0-9]+)$/,
    hiddenFile: /(^|\/)\.[^/.]/g,
    noWord: /\B\W+/g
}