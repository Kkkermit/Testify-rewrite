const { getLatestVersion, checkVersion } = require('./versionHandler/version')
const { asciiText, asciiTextCommitRunner } = require('./asciiText/asciiText')

module.exports = {
    getLatestVersion,
    checkVersion,
    asciiText,
    asciiTextCommitRunner
};