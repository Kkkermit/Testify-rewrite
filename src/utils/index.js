const folderLoader = require("./logging/folderLogging");
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
const { logCommandError } = require("./logging/errorLogging")
const { intents, partials } = require("./clientOptions");
const { addSuffix } = require("./helpers/addSuffix");
const { addBadges } = require("./helpers/discordBadges");
const { getMessagePrefix } = require("./helpers/prefixHelper");

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
	intents,
	partials,
	addSuffix,
	addBadges,
	logCommandError,
	getMessagePrefix
};
