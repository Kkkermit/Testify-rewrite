const { createMockInteraction, createMockClient } = require("../../../../mocks/discordMocks.js");
const pingCommand = require("../../../../../src/commands/SlashCommands/Other/ping.js");

describe("SlashCommand /ping", () => {
	let interaction;
	let client;

	beforeEach(() => {
		interaction = createMockInteraction({ commandName: "ping" });
		client = createMockClient();
	});

	describe("Command structure", () => {
		test("has a data property with a name", () => {
			expect(pingCommand.data).toBeDefined();
			expect(pingCommand.data.name).toBe("ping");
		});

		test("has a description", () => {
			expect(pingCommand.data.description).toBeTruthy();
		});

		test("has an execute function", () => {
			expect(typeof pingCommand.execute).toBe("function");
		});
	});

	describe("Command behaviour", () => {
		test("calls interaction.reply once", async () => {
			await pingCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
		});

		test("replies ephemerally", async () => {
			await pingCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({ flags: expect.anything() }));
		});

		test("sends a message to the channel", async () => {
			await pingCommand.execute(interaction, client);
			expect(interaction.channel.send).toHaveBeenCalledTimes(1);
		});

		test('channel message contains "Pong!"', async () => {
			await pingCommand.execute(interaction, client);
			expect(interaction.channel.send).toHaveBeenCalledWith(expect.objectContaining({ content: "Pong!" }));
		});
	});
});
