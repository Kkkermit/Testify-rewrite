const { checkDmUsability, checkMessageDmUsability } = require("../../../../src/utils/commandParams/checkDmUsability");
const { createMockInteraction, createMockMessage } = require("../../../mocks/discordMocks");

describe("checkDmUsability", () => {
	let command;

	beforeEach(() => {
		command = { data: { name: "test" }, usableInDms: false };
	});

	describe("in a guild", () => {
		test("returns true when interaction is in a guild", () => {
			const interaction = createMockInteraction({ guild: { id: "987654321" } });
			expect(checkDmUsability(command, interaction)).toBe(true);
		});

		test("does not call interaction.reply when in a guild", () => {
			const interaction = createMockInteraction({ guild: { id: "987654321" } });
			checkDmUsability(command, interaction);
			expect(interaction.reply).not.toHaveBeenCalled();
		});

		test("returns true even when usableInDms is true and in a guild", () => {
			command.usableInDms = true;
			const interaction = createMockInteraction({ guild: { id: "987654321" } });
			expect(checkDmUsability(command, interaction)).toBe(true);
		});
	});

	describe("in a DM — command not usable in DMs", () => {
		test("returns false when not in a guild and usableInDms is false", () => {
			const interaction = createMockInteraction({ guild: null });
			expect(checkDmUsability(command, interaction)).toBe(false);
		});

		test("calls interaction.reply when not in a guild and usableInDms is false", () => {
			const interaction = createMockInteraction({ guild: null });
			checkDmUsability(command, interaction);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
		});

		test("reply is ephemeral", () => {
			const interaction = createMockInteraction({ guild: null });
			checkDmUsability(command, interaction);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.flags).toBeDefined();
		});

		test("reply content includes the command name", () => {
			const interaction = createMockInteraction({ guild: null });
			checkDmUsability(command, interaction);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.content).toContain("test");
		});

		test('reply content includes "cannot"', () => {
			const interaction = createMockInteraction({ guild: null });
			checkDmUsability(command, interaction);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.content).toContain("cannot");
		});
	});

	describe("in a DM — command usable in DMs", () => {
		test("returns true when not in a guild but usableInDms is true", () => {
			command.usableInDms = true;
			const interaction = createMockInteraction({ guild: null });
			expect(checkDmUsability(command, interaction)).toBe(true);
		});

		test("does not call interaction.reply when usableInDms is true", () => {
			command.usableInDms = true;
			const interaction = createMockInteraction({ guild: null });
			checkDmUsability(command, interaction);
			expect(interaction.reply).not.toHaveBeenCalled();
		});
	});
});

describe("checkMessageDmUsability", () => {
	let command;

	beforeEach(() => {
		command = { name: "test", usableInDms: false };
	});

	describe("in a guild", () => {
		test("returns true when message is in a guild", () => {
			const message = createMockMessage({ guild: { id: "987654321" } });
			expect(checkMessageDmUsability(command, message)).toBe(true);
		});

		test("does not call message.reply when in a guild", () => {
			const message = createMockMessage({ guild: { id: "987654321" } });
			checkMessageDmUsability(command, message);
			expect(message.reply).not.toHaveBeenCalled();
		});

		test("returns true even when usableInDms is true and in a guild", () => {
			command.usableInDms = true;
			const message = createMockMessage({ guild: { id: "987654321" } });
			expect(checkMessageDmUsability(command, message)).toBe(true);
		});
	});

	describe("in a DM — command not usable in DMs", () => {
		test("returns false when not in a guild and usableInDms is false", () => {
			const message = createMockMessage({ guild: null });
			expect(checkMessageDmUsability(command, message)).toBe(false);
		});

		test("calls message.reply when not in a guild and usableInDms is false", () => {
			const message = createMockMessage({ guild: null });
			checkMessageDmUsability(command, message);
			expect(message.reply).toHaveBeenCalledTimes(1);
		});

		test("reply content includes the command name", () => {
			const message = createMockMessage({ guild: null });
			checkMessageDmUsability(command, message);
			expect(message.reply.mock.calls[0][0]).toContain("test");
		});

		test('reply content includes "cannot"', () => {
			const message = createMockMessage({ guild: null });
			checkMessageDmUsability(command, message);
			expect(message.reply.mock.calls[0][0]).toContain("cannot");
		});
	});

	describe("in a DM — command usable in DMs", () => {
		test("returns true when not in a guild but usableInDms is true", () => {
			command.usableInDms = true;
			const message = createMockMessage({ guild: null });
			expect(checkMessageDmUsability(command, message)).toBe(true);
		});

		test("does not call message.reply when usableInDms is true", () => {
			command.usableInDms = true;
			const message = createMockMessage({ guild: null });
			checkMessageDmUsability(command, message);
			expect(message.reply).not.toHaveBeenCalled();
		});
	});
});
