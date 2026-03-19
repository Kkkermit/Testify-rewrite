jest.mock("../../../../../src/utils/helpers/getGuildPrefix.util", () => ({
	getGuildPrefix: jest.fn().mockResolvedValue("?"),
}));

const { createMockMessage } = require("../../../../mocks/discordMocks.js");
const { makeCommandClient, makeSlashCommand, makePrefixCommand } = require("../../../../mocks/commandMocks.js");
const { PrefixCategory } = require("../../../../../src/utils/helpers/commandCategorys.util.js");
const helpCommand = require("../../../../../src/commands/PrefixCommands/Community/help.js");

const slashCommands = [makeSlashCommand()];
const prefixCommands = [
	makePrefixCommand({ name: "ping", category: PrefixCategory.COMMUNITY }),
	makePrefixCommand({ name: "help", category: PrefixCategory.COMMUNITY }),
];

describe("PrefixCommand ?help", () => {
	let message;
	let client;

	beforeEach(() => {
		message = createMockMessage({ content: "?help" });
		client = makeCommandClient(slashCommands, prefixCommands);
	});

	describe("Command structure", () => {
		test("has a name property", () => {
			expect(helpCommand.name).toBe("help");
		});

		test("has aliases", () => {
			expect(Array.isArray(helpCommand.aliases)).toBe(true);
			expect(helpCommand.aliases.length).toBeGreaterThan(0);
		});

		test("has an execute function", () => {
			expect(typeof helpCommand.execute).toBe("function");
		});

		test("usableInDms is true", () => {
			expect(helpCommand.usableInDms).toBe(true);
		});
	});

	describe("Command behavior — no args (main help menu)", () => {
		test("replies to the message once", async () => {
			await helpCommand.execute(message, client, []);
			expect(message.reply).toHaveBeenCalledTimes(1);
		});

		test("reply includes an embed", async () => {
			await helpCommand.execute(message, client, []);
			const { embeds } = message.reply.mock.calls[0][0];
			expect(embeds).toBeDefined();
			expect(embeds.length).toBeGreaterThan(0);
		});

		test("reply includes components (select menu + switch button)", async () => {
			await helpCommand.execute(message, client, []);
			const { components } = message.reply.mock.calls[0][0];
			expect(components).toBeDefined();
			expect(components.length).toBeGreaterThan(0);
		});

		test("embed title includes the bot username", async () => {
			await helpCommand.execute(message, client, []);
			const embed = message.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.title).toContain(client.user.username);
		});

		test("embed contains a Commands Statistics field", async () => {
			await helpCommand.execute(message, client, []);
			const embed = message.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Commands Statistics"));
			expect(field).toBeDefined();
		});

		test("Commands Statistics field mentions slash and prefix command counts", async () => {
			await helpCommand.execute(message, client, []);
			const embed = message.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Commands Statistics"));
			expect(field.value).toContain(`${slashCommands.length}`);
			expect(field.value).toContain(`${prefixCommands.length}`);
		});

		test("embed contains a prefix field showing the guild name", async () => {
			await helpCommand.execute(message, client, []);
			const embed = message.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("prefix"));
			expect(field.value).toContain(message.guild.name);
		});

		test("embed prefix field shows 'DMs' when there is no guild", async () => {
			message = createMockMessage({ content: "?help", guild: null });
			await helpCommand.execute(message, client, []);
			const embed = message.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("prefix"));
			expect(field.value).toContain("DMs");
		});

		test("embed contains a Categories field", async () => {
			await helpCommand.execute(message, client, []);
			const embed = message.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Categories"));
			expect(field).toBeDefined();
		});

		test("embed contains a Support Server field", async () => {
			await helpCommand.execute(message, client, []);
			const embed = message.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Support Server"));
			expect(field).toBeDefined();
		});

		test("embed contains a Feedback field", async () => {
			await helpCommand.execute(message, client, []);
			const embed = message.reply.mock.calls[0][0].embeds[0];
			const field = embed.data.fields.find((f) => f.name.includes("Feedback"));
			expect(field).toBeDefined();
		});

		test("stores helpData on client", async () => {
			await helpCommand.execute(message, client, []);
			expect(client.helpData).toBeDefined();
			expect(client.helpData).toHaveProperty("slashCommandCategories");
			expect(client.helpData).toHaveProperty("prefixCommandCategories");
			expect(client.helpData).toHaveProperty("guildPrefix");
		});
	});

	describe("Command behavior — with a valid category arg", () => {
		test("replies with a category embed", async () => {
			await helpCommand.execute(message, client, ["community"]);
			expect(message.reply).toHaveBeenCalledTimes(1);
			const { embeds } = message.reply.mock.calls[0][0];
			expect(embeds).toBeDefined();
			expect(embeds.length).toBeGreaterThan(0);
		});

		test("category embed title includes the category name", async () => {
			await helpCommand.execute(message, client, ["community"]);
			const embed = message.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.title).toContain("Community");
		});

		test("reply includes navigation components", async () => {
			await helpCommand.execute(message, client, ["community"]);
			const { components } = message.reply.mock.calls[0][0];
			expect(components.length).toBeGreaterThan(0);
		});

		test("category lookup is case-insensitive", async () => {
			await helpCommand.execute(message, client, ["COMMUNITY"]);
			const { embeds } = message.reply.mock.calls[0][0];
			expect(embeds).toBeDefined();
		});
	});

	describe("Command behavior — with an invalid category arg", () => {
		test("replies with a not-found message", async () => {
			await helpCommand.execute(message, client, ["nonexistent"]);
			expect(message.reply).toHaveBeenCalledTimes(1);
			const reply = message.reply.mock.calls[0][0];
			expect(typeof reply).toBe("string");
		});

		test("not-found message mentions the invalid category name", async () => {
			await helpCommand.execute(message, client, ["nonexistent"]);
			expect(message.reply.mock.calls[0][0]).toContain("Nonexistent");
		});
	});
});
