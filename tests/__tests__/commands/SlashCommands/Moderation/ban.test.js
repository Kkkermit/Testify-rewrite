const { createMockInteraction, createMockClient } = require("../../../../mocks/discordMocks.js");
const banCommand = require("../../../../../src/commands/SlashCommands/Moderation/ban.js");

const BANNED_USER = {
	id: "222222222",
	tag: "BannedUser#0001",
	send: jest.fn().mockResolvedValue({}),
};

describe("SlashCommand /ban", () => {
	let interaction;
	let client;

	beforeEach(() => {
		jest.clearAllMocks();
		BANNED_USER.send = jest.fn().mockResolvedValue({});
		interaction = createMockInteraction({
			user: { id: "123456789", tag: "Moderator#0001", username: "Moderator" },
			guild: {
				id: "987654321",
				name: "Test Server",
				fetch: jest.fn().mockResolvedValue({
					id: "987654321",
					name: "Test Server",
					members: {
						ban: jest.fn().mockResolvedValue(BANNED_USER),
					},
				}),
			},
			channel: { send: jest.fn(), sendTyping: jest.fn().mockResolvedValue({}) },
			options: {
				getUser: jest.fn().mockReturnValue(BANNED_USER),
				getString: jest.fn().mockReturnValue(null),
			},
		});
		client = createMockClient();
	});

	describe("Command structure", () => {
		test("has a data property with the correct name", () => {
			expect(banCommand.data).toBeDefined();
			expect(banCommand.data.name).toBe("ban");
		});

		test("has a description", () => {
			expect(banCommand.data.description).toBeTruthy();
		});

		test("has an execute function", () => {
			expect(typeof banCommand.execute).toBe("function");
		});

		test("is not usable in DMs", () => {
			expect(banCommand.usableInDms).toBe(false);
		});

		test("requires BanMembers permission", () => {
			const { PermissionFlagsBits } = require("discord.js");
			expect(banCommand.permissions).toContain(PermissionFlagsBits.BanMembers);
		});
	});

	describe("Successful ban", () => {
		test("fetches the guild", async () => {
			await banCommand.execute(interaction, client);
			expect(interaction.guild.fetch).toHaveBeenCalledTimes(1);
		});

		test("sends a DM to the banned user", async () => {
			await banCommand.execute(interaction, client);
			expect(BANNED_USER.send).toHaveBeenCalledTimes(1);
		});

		test("DM contains an embed", async () => {
			await banCommand.execute(interaction, client);
			const dmArgs = BANNED_USER.send.mock.calls[0][0];
			expect(dmArgs.embeds).toBeDefined();
			expect(dmArgs.embeds.length).toBeGreaterThan(0);
		});

		test("calls interaction.reply once with a ban embed", async () => {
			await banCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
			const replyArgs = interaction.reply.mock.calls[0][0];
			expect(replyArgs.embeds).toBeDefined();
			expect(replyArgs.embeds.length).toBeGreaterThan(0);
		});

		test("ban embed contains the user field", async () => {
			await banCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const userField = embed.data.fields.find((f) => f.name === "User");
			expect(userField).toBeDefined();
			expect(userField.value).toContain(BANNED_USER.tag);
		});

		test("ban embed contains the reason field", async () => {
			await banCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField).toBeDefined();
		});

		test("uses default reason when none is provided", async () => {
			await banCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField.value).toContain("Reason for ban not given");
		});

		test("uses provided reason when one is given", async () => {
			interaction.options.getString = jest.fn().mockReturnValue("Spamming");
			await banCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField.value).toContain("Spamming");
		});

		test("embed author includes devBy config", async () => {
			await banCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.author.name).toContain(client.config.devBy);
		});

		test("embed footer mentions ban hammer", async () => {
			await banCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.footer.text).toContain("ban hammer");
		});
	});

	describe("Self-ban guard", () => {
		test("replies ephemerally when user tries to ban the bot", async () => {
			interaction.options.getUser = jest
				.fn()
				.mockReturnValue({ id: client.user.id, tag: "Testify#0001", send: jest.fn() });
			await banCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
			const replyArgs = interaction.reply.mock.calls[0][0];
			expect(replyArgs.content).toContain("cannot");
			expect(replyArgs.flags).toBeDefined();
		});

		test("does not attempt to ban when user targets the bot", async () => {
			const fetchedGuild = { members: { ban: jest.fn() }, name: "Test Server" };
			interaction.guild.fetch = jest.fn().mockResolvedValue(fetchedGuild);
			interaction.options.getUser = jest
				.fn()
				.mockReturnValue({ id: client.user.id, tag: "Testify#0001", send: jest.fn() });
			await banCommand.execute(interaction, client);
			expect(fetchedGuild.members.ban).not.toHaveBeenCalled();
		});
	});

	describe("Failed ban", () => {
		test("replies ephemerally when ban fails", async () => {
			const fetchedGuild = {
				name: "Test Server",
				members: { ban: jest.fn().mockResolvedValue(null) },
			};
			interaction.guild.fetch = jest.fn().mockResolvedValue(fetchedGuild);
			await banCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
			const replyArgs = interaction.reply.mock.calls[0][0];
			expect(replyArgs.flags).toBeDefined();
		});

		test("error reply mentions the user tag when ban fails", async () => {
			const fetchedGuild = {
				name: "Test Server",
				members: { ban: jest.fn().mockResolvedValue(null) },
			};
			interaction.guild.fetch = jest.fn().mockResolvedValue(fetchedGuild);
			await banCommand.execute(interaction, client);
			const replyArgs = interaction.reply.mock.calls[0][0];
			expect(replyArgs.content).toContain(BANNED_USER.tag);
		});
	});
});
