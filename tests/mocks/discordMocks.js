/**
 * Shared Discord mock factory for unit tests.
 * Call createMockInteraction() for slash commands, createMockMessage() for prefix commands.
 * Call createMockSubcommandInteraction() for slash commands that use subcommands.
 *  
 *  
 */

const config = require("../../src/config");
function createMockInteraction(overrides = {}) {
	const interaction = {
		commandName: "test",
		user: {
			id: "123456789",
			username: "TestUser",
			avatarURL: jest.fn().mockReturnValue("https://example.com/avatar.png"),
		},
		guild: {
			id: "987654321",
			name: "Test Server",
		},
		channel: {
			send: jest.fn().mockResolvedValue({}),
		},
		reply: jest.fn().mockResolvedValue({}),
		editReply: jest.fn().mockResolvedValue({}),
		deferReply: jest.fn().mockResolvedValue({}),
		followUp: jest.fn().mockResolvedValue({}),
		isChatInputCommand: jest.fn().mockReturnValue(true),
		isCommand: jest.fn().mockReturnValue(true),
		options: {
			getString: jest.fn().mockReturnValue(null),
			getInteger: jest.fn().mockReturnValue(null),
			getUser: jest.fn().mockReturnValue(null),
			getMember: jest.fn().mockReturnValue(null),
			getBoolean: jest.fn().mockReturnValue(null),
			getChannel: jest.fn().mockReturnValue(null),
			getRole: jest.fn().mockReturnValue(null),
		},
		...overrides,
	};
	return interaction;
}

function createMockMessage(overrides = {}) {
	const message = {
		author: {
			id: "123456789",
			username: "TestUser",
			bot: false,
			avatarURL: jest.fn().mockReturnValue("https://example.com/avatar.png"),
		},
		guild: {
			id: "987654321",
			name: "Test Server",
		},
		channel: {
			send: jest.fn().mockResolvedValue({}),
		},
		reply: jest.fn().mockResolvedValue({}),
		content: "",
		...overrides,
	};
	return message;
}

function createMockClient(overrides = {}) {
	const client = {
		user: {
			id: "111111111",
			username: "Testify",
			avatarURL: jest.fn().mockReturnValue("https://example.com/bot-avatar.png"),
			displayAvatarURL: jest.fn().mockReturnValue("https://example.com/bot-avatar.png"),
		},
		config,
		ws: {
			ping: 42,
		},
		guilds: {
			cache: {
				size: 5,
				reduce: jest.fn().mockReturnValue(150),
			},
		},
		commands: { size: 10 },
		pcommands: { size: 8 },
		aliases: { size: 4 },
		logs: {
			info: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
			success: jest.fn(),
			debug: jest.fn(),
		},
		...overrides,
	};
	return client;
}

function createMockSubcommandInteraction(sub, optionOverrides = {}, interactionOverrides = {}) {
	return createMockInteraction({
		options: {
			getSubcommand: jest.fn().mockReturnValue(sub),
			getString: jest.fn().mockReturnValue(optionOverrides.string ?? null),
			getBoolean: jest.fn().mockReturnValue(optionOverrides.boolean ?? null),
			getInteger: jest.fn().mockReturnValue(optionOverrides.integer ?? null),
			getUser: jest.fn().mockReturnValue(optionOverrides.user ?? null),
			getMember: jest.fn().mockReturnValue(optionOverrides.member ?? null),
			getChannel: jest.fn().mockReturnValue(optionOverrides.channel ?? null),
			getRole: jest.fn().mockReturnValue(optionOverrides.role ?? null),
		},
		...interactionOverrides,
	});
}

module.exports = { createMockInteraction, createMockMessage, createMockClient, createMockSubcommandInteraction };
