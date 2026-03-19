const { SlashCategory, PrefixCategory } = require("../../src/utils/helpers/commandCategorys.util");

/**
 * Shared command mock factories for unit tests.
 * Use these when testing utilities that operate on command objects,
 * such as helpCommandsUtil, category grouping, or permission checks.
 *
 * makeSlashCommand()        - base slash command object
 * makeSubcommandOption()    - slash subcommand option (type === 1)
 * makeNonSubcommandOption() - slash non-subcommand option (type !== 1)
 * makePrefixCommand()       - base prefix command object
 * makeCommandClient()       - lightweight client with forEach-capable commands/pcommands
 */

function makeSlashCommand(overrides = {}) {
	return {
		category: SlashCategory.INFO,
		usableInDms: false,
		underDevelopment: false,
		data: {
			name: "test",
			description: "A test command",
			options: [],
		},
		...overrides,
	};
}

function makeSubcommandOption(name, description) {
	return {
		name,
		description,
		toJSON: () => ({ type: 1, name, description }),
	};
}

function makeNonSubcommandOption(name) {
	return {
		name,
		toJSON: () => ({ type: 3 }), // type 3 = STRING, not a subcommand
	};
}

function makePrefixCommand(overrides = {}) {
	return {
		name: "ptest",
		description: "A prefix test command",
		category: PrefixCategory.INFO,
		usableInDms: false,
		underDevelopment: false,
		aliases: [],
		subcommands: [],
		...overrides,
	};
}

/**
 * Creates a minimal client whose commands/pcommands support forEach and size,
 * suitable for testing utilities like getSlashCommandsByCategory and help commands.
 */
function makeCommandClient(slashCommands = [], prefixCommands = []) {
	const { createMockClient } = require("./discordMocks");
	return createMockClient({
		commands: {
			size: slashCommands.length,
			forEach: (fn) => slashCommands.forEach(fn),
		},
		pcommands: {
			size: prefixCommands.length,
			forEach: (fn) => prefixCommands.forEach(fn),
		},
	});
}

module.exports = {
	makeSlashCommand,
	makeSubcommandOption,
	makeNonSubcommandOption,
	makePrefixCommand,
	makeCommandClient,
};
