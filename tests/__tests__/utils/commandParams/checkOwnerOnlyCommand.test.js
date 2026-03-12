const {
	checkOwnerOnly,
	checkMessageOwnerOnly,
	checkDevOnly,
	checkMessageDevOnly,
} = require("../../../../src/utils/commandParams/checkOwnerDeveloperCommands");
const { createMockInteraction, createMockMessage } = require("../../../mocks/discordMocks");
const config = require("../../../../src/config");

const OWNER_ID = "999000999";
const DEV_ID = "111222333";
const RANDOM_ID = "555666777";

beforeAll(() => {
	process.env.devid = OWNER_ID;
});

describe("checkOwnerOnly", () => {
	let command;

	beforeEach(() => {
		command = { data: { name: "secret" }, ownerOnly: true };
	});

	describe("ownerOnly is false / unset", () => {
		test("returns true when ownerOnly is false", () => {
			command.ownerOnly = false;
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			expect(checkOwnerOnly(command, interaction)).toBe(true);
		});

		test("returns true when ownerOnly is undefined", () => {
			delete command.ownerOnly;
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			expect(checkOwnerOnly(command, interaction)).toBe(true);
		});

		test("does not reply when ownerOnly is false", () => {
			command.ownerOnly = false;
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			checkOwnerOnly(command, interaction);
			expect(interaction.reply).not.toHaveBeenCalled();
		});
	});

	describe("ownerOnly is true — owner user", () => {
		test("returns true when the user is the owner", () => {
			const interaction = createMockInteraction({ user: { id: OWNER_ID } });
			expect(checkOwnerOnly(command, interaction)).toBe(true);
		});

		test("does not reply when the user is the owner", () => {
			const interaction = createMockInteraction({ user: { id: OWNER_ID } });
			checkOwnerOnly(command, interaction);
			expect(interaction.reply).not.toHaveBeenCalled();
		});
	});

	describe("ownerOnly is true — non-owner user", () => {
		test("returns false when the user is not the owner", () => {
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			expect(checkOwnerOnly(command, interaction)).toBe(false);
		});

		test("calls interaction.reply when the user is not the owner", () => {
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			checkOwnerOnly(command, interaction);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
		});

		test("reply is ephemeral", () => {
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			checkOwnerOnly(command, interaction);
			expect(interaction.reply.mock.calls[0][0].flags).toBeDefined();
		});

		test("reply content includes the command name", () => {
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			checkOwnerOnly(command, interaction);
			expect(interaction.reply.mock.calls[0][0].content).toContain("secret");
		});

		test('reply content mentions "bot owner"', () => {
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			checkOwnerOnly(command, interaction);
			expect(interaction.reply.mock.calls[0][0].content).toContain("bot owner");
		});
	});
});

describe("checkMessageOwnerOnly", () => {
	let command;

	beforeEach(() => {
		command = { name: "secret", ownerOnly: true };
	});

	describe("ownerOnly is false / unset", () => {
		test("returns true when ownerOnly is false", () => {
			command.ownerOnly = false;
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			expect(checkMessageOwnerOnly(command, message)).toBe(true);
		});

		test("does not reply when ownerOnly is false", () => {
			command.ownerOnly = false;
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			checkMessageOwnerOnly(command, message);
			expect(message.reply).not.toHaveBeenCalled();
		});
	});

	describe("ownerOnly is true — owner user", () => {
		test("returns true when the author is the owner", () => {
			const message = createMockMessage({ author: { id: OWNER_ID } });
			expect(checkMessageOwnerOnly(command, message)).toBe(true);
		});

		test("does not reply when the author is the owner", () => {
			const message = createMockMessage({ author: { id: OWNER_ID } });
			checkMessageOwnerOnly(command, message);
			expect(message.reply).not.toHaveBeenCalled();
		});
	});

	describe("ownerOnly is true — non-owner user", () => {
		test("returns false when the author is not the owner", () => {
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			expect(checkMessageOwnerOnly(command, message)).toBe(false);
		});

		test("calls message.reply when the author is not the owner", () => {
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			checkMessageOwnerOnly(command, message);
			expect(message.reply).toHaveBeenCalledTimes(1);
		});

		test("reply content includes the command name", () => {
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			checkMessageOwnerOnly(command, message);
			expect(message.reply.mock.calls[0][0]).toContain("secret");
		});

		test('reply content mentions "bot owner"', () => {
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			checkMessageOwnerOnly(command, message);
			expect(message.reply.mock.calls[0][0]).toContain("bot owner");
		});
	});
});

describe("checkDevOnly", () => {
	let command;

	beforeEach(() => {
		command = { data: { name: "devtool" }, devOnly: true };
		// Ensure a known dev ID is in the config for these tests
		config.developerIds = [DEV_ID];
	});

	describe("devOnly is false / unset", () => {
		test("returns true when devOnly is false", () => {
			command.devOnly = false;
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			expect(checkDevOnly(command, interaction)).toBe(true);
		});

		test("returns true when devOnly is undefined", () => {
			delete command.devOnly;
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			expect(checkDevOnly(command, interaction)).toBe(true);
		});

		test("does not reply when devOnly is false", () => {
			command.devOnly = false;
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			checkDevOnly(command, interaction);
			expect(interaction.reply).not.toHaveBeenCalled();
		});
	});

	describe("devOnly is true — developer user", () => {
		test("returns true when the user is in developerIds", () => {
			const interaction = createMockInteraction({ user: { id: DEV_ID } });
			expect(checkDevOnly(command, interaction)).toBe(true);
		});

		test("does not reply when the user is a developer", () => {
			const interaction = createMockInteraction({ user: { id: DEV_ID } });
			checkDevOnly(command, interaction);
			expect(interaction.reply).not.toHaveBeenCalled();
		});

		test("returns true for any id listed in developerIds", () => {
			config.developerIds = [DEV_ID, OWNER_ID];
			const interaction = createMockInteraction({ user: { id: OWNER_ID } });
			expect(checkDevOnly(command, interaction)).toBe(true);
		});
	});

	describe("devOnly is true — non-developer user", () => {
		test("returns false when the user is not in developerIds", () => {
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			expect(checkDevOnly(command, interaction)).toBe(false);
		});

		test("calls interaction.reply when the user is not a developer", () => {
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			checkDevOnly(command, interaction);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
		});

		test("reply is ephemeral", () => {
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			checkDevOnly(command, interaction);
			expect(interaction.reply.mock.calls[0][0].flags).toBeDefined();
		});

		test("reply content includes the command name", () => {
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			checkDevOnly(command, interaction);
			expect(interaction.reply.mock.calls[0][0].content).toContain("devtool");
		});

		test('reply content mentions "bot developers"', () => {
			const interaction = createMockInteraction({ user: { id: RANDOM_ID } });
			checkDevOnly(command, interaction);
			expect(interaction.reply.mock.calls[0][0].content).toContain("bot developers");
		});
	});
});

describe("checkMessageDevOnly", () => {
	let command;

	beforeEach(() => {
		command = { name: "devtool", devOnly: true };
		config.developerIds = [DEV_ID];
	});

	describe("devOnly is false / unset", () => {
		test("returns true when devOnly is false", () => {
			command.devOnly = false;
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			expect(checkMessageDevOnly(command, message)).toBe(true);
		});

		test("does not reply when devOnly is false", () => {
			command.devOnly = false;
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			checkMessageDevOnly(command, message);
			expect(message.reply).not.toHaveBeenCalled();
		});
	});

	describe("devOnly is true — developer user", () => {
		test("returns true when the author is in developerIds", () => {
			const message = createMockMessage({ author: { id: DEV_ID } });
			expect(checkMessageDevOnly(command, message)).toBe(true);
		});

		test("does not reply when the author is a developer", () => {
			const message = createMockMessage({ author: { id: DEV_ID } });
			checkMessageDevOnly(command, message);
			expect(message.reply).not.toHaveBeenCalled();
		});
	});

	describe("devOnly is true — non-developer user", () => {
		test("returns false when the author is not in developerIds", () => {
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			expect(checkMessageDevOnly(command, message)).toBe(false);
		});

		test("calls message.reply when the author is not a developer", () => {
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			checkMessageDevOnly(command, message);
			expect(message.reply).toHaveBeenCalledTimes(1);
		});

		test("reply content includes the command name", () => {
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			checkMessageDevOnly(command, message);
			expect(message.reply.mock.calls[0][0]).toContain("devtool");
		});

		test('reply content mentions "bot developers"', () => {
			const message = createMockMessage({ author: { id: RANDOM_ID } });
			checkMessageDevOnly(command, message);
			expect(message.reply.mock.calls[0][0]).toContain("bot developers");
		});
	});
});
