const folderLoader = require("./logging/folderLoader");
const {
	write,
	info,
	warn,
	error,
	success,
	debug,
	logging,
	torquise,
	purple,
	color,
	getTimestamp,
} = require("./logging/logs");
const { gatewayIntentBits, partials} = require("./intents")
const { addSuffix } = require("./helpers/addSuffix")
const { addBadges } = require("./helpers/discordBadges")
const { getBotStats } = require("./helpers/botStats")
const { checkDmUsability, checkMessageDmUsability } = require("./commandParams/checkDmUsability");
const { checkUnderDevelopment, checkMessageUnderDevelopment } = require("./commandParams/checkUnderDevelopment");

module.exports = {
	folderLoader,
	color,
	getTimestamp,
	write,
	info,
	warn,
	error,
	success,
	debug,
	logging,
	torquise,
	purple,
	gatewayIntentBits,
	partials,
	addSuffix,
	addBadges,
	getBotStats,
	checkDmUsability,
	checkMessageDmUsability,
	checkUnderDevelopment,
	checkMessageUnderDevelopment
};
