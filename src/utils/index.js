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
const { intents, partials } = require("./clientOptions");

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
	partials
};
