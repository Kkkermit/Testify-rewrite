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
const { gatewayIntentBits, partials } = require("./intents");
const { addSuffix } = require("./helpers/addSuffix");
const { addBadges } = require("./helpers/discordBadges");
const { getBotStats } = require("./helpers/botStats");
const { checkDmUsability, checkMessageDmUsability } = require("./commandParams/checkDmUsability");
const { checkUnderDevelopment, checkMessageUnderDevelopment } = require("./commandParams/checkUnderDevelopment");
const { SlashCategory, PrefixCategory } = require("./helpers/commandCategorys");
const { getGuildPrefix } = require("./helpers/getGuildPrefix");
const {
	checkOwnerOnly,
	checkMessageOwnerOnly,
	checkDevOnly,
	checkMessageDevOnly,
} = require("./commandParams/checkOwnerDeveloperCommands");
const {
	getSlashCommandsByCategory,
	getPrefixCommandsByCategory,
	createCommandPages,
	getCategoryEmoji,
} = require("./helpers/helpCommandsUtil");
const { getImages } = require("./helpers/images");

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
	checkMessageUnderDevelopment,
	SlashCategory,
	PrefixCategory,
	getGuildPrefix,
	checkOwnerOnly,
	checkMessageOwnerOnly,
	checkDevOnly,
	checkMessageDevOnly,
	getSlashCommandsByCategory,
	getPrefixCommandsByCategory,
	createCommandPages,
	getCategoryEmoji,
	getImages,
};
