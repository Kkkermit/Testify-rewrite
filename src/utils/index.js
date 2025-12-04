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
	color,
	getTimestamp,
	intents,
	partials,
	addSuffix,
	addBadges,
	logCommandError
};
