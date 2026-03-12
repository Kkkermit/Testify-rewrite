const { createMockMessage, createMockClient } = require("../../../../mocks/discordMocks.js");
const pingCommand = require("../../../../../src/commands/PrefixCommands/Other/ping.js");

describe("PrefixCommand ?ping", () => {
	let message;
	let client;

	beforeEach(() => {
		message = createMockMessage({ content: "?ping" });
		client = createMockClient();
	});

	describe("Command structure", () => {
		test("has a name property", () => {
			expect(pingCommand.name).toBe("ping");
		});

		test("has an execute function", () => {
			expect(typeof pingCommand.execute).toBe("function");
		});
	});

	describe("Command behavior", () => {
		test("sends a message to the channel", async () => {
			await pingCommand.execute(message, client);
			expect(message.channel.send).toHaveBeenCalledTimes(1);
		});

		test("sends an embed", async () => {
			await pingCommand.execute(message, client);
			const callArgs = message.channel.send.mock.calls[0][0];
			expect(callArgs.embeds).toBeDefined();
			expect(callArgs.embeds.length).toBeGreaterThan(0);
		});

		test("embed description includes the bot ping", async () => {
			await pingCommand.execute(message, client);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			const description = embed.data.description;
			expect(description).toContain(`${client.ws.ping}ms`);
		});

		test("embed footer shows the requesting user", async () => {
			await pingCommand.execute(message, client);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			expect(embed.data.footer.text).toContain(message.author.username);
		});
	});
});
