jest.mock("../../../../../src/utils/helpers/getGuildPrefix", () => ({
	getGuildPrefix: jest.fn().mockResolvedValue("?"),
}));

const { createMockSubcommandInteraction } = require("../../../../mocks/discordMocks.js");
const { makeCommandClient, makeSlashCommand, makePrefixCommand } = require("../../../../mocks/commandMocks.js");
const { SlashCategory, PrefixCategory } = require("../../../../../src/utils/helpers/commandCategorys");
const helpCommand = require("../../../../../src/commands/SlashCommands/Community/help.js");

const slashCommands = [
	makeSlashCommand({ category: SlashCategory.INFO }),
	makeSlashCommand({
		category: SlashCategory.COMMUNITY,
		data: { name: "help", description: "Help command", options: [] },
	}),
];
const prefixCommands = [
	makePrefixCommand({ name: "ping", category: PrefixCategory.COMMUNITY }),
	makePrefixCommand({ name: "help", category: PrefixCategory.COMMUNITY }),
];

describe("SlashCommand /help", () => {
	let client;

	beforeEach(() => {
		client = makeCommandClient(slashCommands, prefixCommands);
	});

	describe("Command structure", () => {
		test("has a data property with name 'help'", () => {
			expect(helpCommand.data.name).toBe("help");
		});

		test("has a description", () => {
			expect(helpCommand.data.description).toBeTruthy();
		});

		test("has an execute function", () => {
			expect(typeof helpCommand.execute).toBe("function");
		});

		test("usableInDms is true", () => {
			expect(helpCommand.usableInDms).toBe(true);
		});

		test("has a category", () => {
			expect(helpCommand.category).toBeDefined();
		});

		test("has the server subcommand", () => {
			const json = helpCommand.data.toJSON();
			const sub = json.options.find((o) => o.name === "server");
			expect(sub).toBeDefined();
		});

		test("has the manual subcommand", () => {
			const json = helpCommand.data.toJSON();
			const sub = json.options.find((o) => o.name === "manual");
			expect(sub).toBeDefined();
		});
	});

	describe("Subcommand: /help server", () => {
		let interaction;

		beforeEach(() => {
			interaction = createMockSubcommandInteraction("server", {}, { guild: { id: "987654321", name: "Test Server" } });
		});

		test("replies once", async () => {
			await helpCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
		});

		test("reply includes an embed", async () => {
			await helpCommand.execute(interaction, client);
			const { embeds } = interaction.reply.mock.calls[0][0];
			expect(embeds).toBeDefined();
			expect(embeds.length).toBeGreaterThan(0);
		});

		test("reply includes a link button component", async () => {
			await helpCommand.execute(interaction, client);
			const { components } = interaction.reply.mock.calls[0][0];
			expect(components).toBeDefined();
			expect(components.length).toBeGreaterThan(0);
		});

		test("embed title includes the bot username", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.title).toContain(client.user.username);
		});

		test("embed description mentions the support server", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.description).toContain("support server");
		});

		test("embed contains a server invite link field", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Discord server"));
			expect(field).toBeDefined();
		});

		test("invite field value contains the bot server invite URL", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Discord server"));
			expect(field.value).toContain(client.config.botServerInvite);
		});

		test("reply is not ephemeral", async () => {
			await helpCommand.execute(interaction, client);
			const replyArgs = interaction.reply.mock.calls[0][0];
			expect(replyArgs.flags).toBeUndefined();
		});
	});

	describe("Subcommand: /help manual", () => {
		let interaction;

		beforeEach(() => {
			interaction = createMockSubcommandInteraction("manual", {}, { guild: { id: "987654321", name: "Test Server" } });
		});

		test("replies once", async () => {
			await helpCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
		});

		test("reply includes an embed", async () => {
			await helpCommand.execute(interaction, client);
			const { embeds } = interaction.reply.mock.calls[0][0];
			expect(embeds).toBeDefined();
			expect(embeds.length).toBeGreaterThan(0);
		});

		test("reply is ephemeral", async () => {
			await helpCommand.execute(interaction, client);
			const replyArgs = interaction.reply.mock.calls[0][0];
			expect(replyArgs.flags).toBeDefined();
		});

		test("reply includes components (select menu + switch button)", async () => {
			await helpCommand.execute(interaction, client);
			const { components } = interaction.reply.mock.calls[0][0];
			expect(components.length).toBeGreaterThan(0);
		});

		test("embed title includes the bot username", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.title).toContain(client.user.username);
		});

		test("embed contains a Commands Statistics field", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Commands Statistics"));
			expect(field).toBeDefined();
		});

		test("Commands Statistics field mentions slash and prefix command counts", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Commands Statistics"));
			expect(field.value).toContain(`${slashCommands.length}`);
			expect(field.value).toContain(`${prefixCommands.length}`);
		});

		test("embed contains a prefix field showing the guild name", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("prefix"));
			expect(field.value).toContain(interaction.guild.name);
		});

		test("embed prefix field falls back to bot username in a DM", async () => {
			interaction = createMockSubcommandInteraction("manual", {}, { guild: null });
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("prefix"));
			expect(field.value).toContain(client.user.username);
		});

		test("embed contains a Categories field", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Categories"));
			expect(field).toBeDefined();
		});

		test("embed contains a Support Server field", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Support Server"));
			expect(field).toBeDefined();
		});

		test("embed contains a Feedback field", async () => {
			await helpCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Feedback"));
			expect(field).toBeDefined();
		});

		test("stores helpData on interaction.client", async () => {
			await helpCommand.execute(interaction, client);
			expect(interaction.client.helpData).toBeDefined();
			expect(interaction.client.helpData).toHaveProperty("slashCommandCategories");
			expect(interaction.client.helpData).toHaveProperty("prefixCommandCategories");
			expect(interaction.client.helpData).toHaveProperty("guildPrefix");
		});
	});
});
