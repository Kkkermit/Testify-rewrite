const { createMockInteraction, createMockClient } = require("../../../../mocks/discordMocks");
const { MessageFlags } = require("discord.js");

const adviceCommand = require("../../../../../src/commands/SlashCommands/Community/advice");

const mockAdviceResponse = (advice = "Take it one day at a time.") => {
	global.fetch = jest.fn().mockResolvedValue({
		json: jest.fn().mockResolvedValue({ slip: { id: 1, advice } }),
	});
};

describe("SlashCommand /advice", () => {
	let interaction;
	let client;

	beforeEach(() => {
		interaction = createMockInteraction({ commandName: "advice" });
		client = createMockClient();
		mockAdviceResponse();
	});

	describe("Command structure", () => {
		test("has a data property with the correct name", () => {
			expect(adviceCommand.data).toBeDefined();
			expect(adviceCommand.data.name).toBe("advice");
		});

		test("has a description", () => {
			expect(adviceCommand.data.description).toBeTruthy();
		});

		test("has an execute function", () => {
			expect(typeof adviceCommand.execute).toBe("function");
		});

		test("is usable in DMs", () => {
			expect(adviceCommand.usableInDms).toBe(true);
		});
	});

	describe("Successful fetch", () => {
		test("calls fetch with the advice slip API url", async () => {
			await adviceCommand.execute(interaction, client);
			expect(global.fetch).toHaveBeenCalledWith("https://api.adviceslip.com/advice");
		});

		test("calls interaction.reply once", async () => {
			await adviceCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
		});

		test("replies with an embed", async () => {
			await adviceCommand.execute(interaction, client);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.embeds).toBeDefined();
			expect(replyArg.embeds).toHaveLength(1);
		});

		test("embed contains the advice text in an Advice field", async () => {
			mockAdviceResponse("Keep going, you're doing great.");
			await adviceCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const adviceField = embed.data.fields.find((f) => f.name === "Advice");
			expect(adviceField).toBeDefined();
			expect(adviceField.value).toContain("Keep going, you're doing great.");
		});

		test("embed title includes the bot username", async () => {
			await adviceCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.title).toContain(client.user.username);
		});

		test("embed title includes the arrowEmoji from config", async () => {
			await adviceCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.title).toContain(client.config.arrowEmoji);
		});

		test("embed author includes devBy from config", async () => {
			await adviceCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.author.name).toContain(client.config.devBy);
		});

		test("embed footer says 'Advice given free of charge'", async () => {
			await adviceCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.footer.text).toBe("Advice given free of charge");
		});

		test("embed description contains the header text", async () => {
			await adviceCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.description).toContain("Here is your random advice");
		});

		test("embed thumbnail is set to the bot avatar URL", async () => {
			await adviceCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.thumbnail.url).toBe(client.user.avatarURL());
		});

		test("does not reply ephemerally on success", async () => {
			await adviceCommand.execute(interaction, client);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.flags).toBeUndefined();
		});
	});

	describe("Failed fetch — null data", () => {
		test("replies with an error message when fetch returns null", async () => {
			global.fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(null) });
			await adviceCommand.execute(interaction, client);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.content).toContain("couldn't fetch advice");
		});

		test("reply is ephemeral when fetch returns null", async () => {
			global.fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(null) });
			await adviceCommand.execute(interaction, client);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.flags).toBe(MessageFlags.Ephemeral);
		});

		test("does not send an embed when fetch returns null", async () => {
			global.fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(null) });
			await adviceCommand.execute(interaction, client);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.embeds).toBeUndefined();
		});
	});

	describe("Failed fetch — missing slip", () => {
		test("replies with an error message when slip is missing", async () => {
			global.fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue({ slip: null }) });
			await adviceCommand.execute(interaction, client);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.content).toContain("couldn't fetch advice");
		});

		test("reply is ephemeral when slip is missing", async () => {
			global.fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue({ slip: null }) });
			await adviceCommand.execute(interaction, client);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.flags).toBe(MessageFlags.Ephemeral);
		});
	});

	describe("Failed fetch — missing advice text", () => {
		test("replies with an error message when advice text is missing", async () => {
			global.fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue({ slip: { id: 1 } }) });
			await adviceCommand.execute(interaction, client);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.content).toContain("couldn't fetch advice");
		});

		test("reply is ephemeral when advice text is missing", async () => {
			global.fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue({ slip: { id: 1 } }) });
			await adviceCommand.execute(interaction, client);
			const replyArg = interaction.reply.mock.calls[0][0];
			expect(replyArg.flags).toBe(MessageFlags.Ephemeral);
		});
	});
});
