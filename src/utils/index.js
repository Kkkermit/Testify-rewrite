const folderLoader = require("./logging/folderLoader.util");
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
} = require("./logging/logs.util");
const { gatewayIntentBits, partials } = require("./intents.util");
const { addSuffix } = require("./helpers/addSuffix.util");
const { addBadges } = require("./helpers/discordBadges.util");
const { getBotStats } = require("./helpers/botStats.util");
const { checkDmUsability, checkMessageDmUsability } = require("./commandParams/checkDmUsability.util");
const { checkUnderDevelopment, checkMessageUnderDevelopment } = require("./commandParams/checkUnderDevelopment.util");
const { SlashCategory, PrefixCategory } = require("./helpers/commandCategorys.util");
const { getGuildPrefix } = require("./helpers/getGuildPrefix.util");
const {
	checkOwnerOnly,
	checkMessageOwnerOnly,
	checkDevOnly,
	checkMessageDevOnly,
} = require("./commandParams/checkOwnerDeveloperCommands.util");
const {
	getSlashCommandsByCategory,
	getPrefixCommandsByCategory,
	createCommandPages,
	getCategoryEmoji,
} = require("./helpers/helpCommands.util");
const { getImages } = require("./helpers/images.util");
const { filter, filterWords, filterSet, isFiltered, containsFilteredWord } = require("./helpers/filter.util");

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
	filter,
	filterWords,
	filterSet,
	isFiltered,
	containsFilteredWord,
};
