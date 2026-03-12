const { createMockInteraction, createMockClient } = require("../../../../mocks/discordMocks.js");
const testCommand = require("../../../../../src/commands/SlashCommands/Community/test.js");

describe("SlashCommand /test", () => {
	let interaction;
	let client;

	beforeEach(() => {
		interaction = createMockInteraction({ commandName: "test" });
		client = createMockClient();
	});

	describe("Command structure", () => {
		test("has a data property with a name", () => {
			expect(testCommand.data).toBeDefined();
			expect(testCommand.data.name).toBe("test");
		});

		test("has a description", () => {
			expect(testCommand.data.description).toBeTruthy();
		});

		test("has an execute function", () => {
			expect(typeof testCommand.execute).toBe("function");
		});
	});

	describe("Command behavior", () => {
		test("calls interaction.reply once", async () => {
			await testCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
		});

		test("reply mentions the user", async () => {
			await testCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({ content: `<@${interaction.user.id}>` }));
		});

		test("reply includes an embed", async () => {
			await testCommand.execute(interaction, client);
			const callArgs = interaction.reply.mock.calls[0][0];
			expect(callArgs.embeds).toBeDefined();
			expect(callArgs.embeds.length).toBeGreaterThan(0);
		});
	});
});
