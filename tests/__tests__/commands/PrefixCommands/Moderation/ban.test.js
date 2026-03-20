const { createMockMessage, createMockClient } = require("../../../../mocks/discordMocks.js");
const banCommand = require("../../../../../src/commands/PrefixCommands/Moderation/ban.prefix.js");
const { PermissionFlagsBits } = require("discord.js");

const BANNED_MEMBER = {
	id: "222222222",
	tag: "BannedUser#0001",
	bannable: true,
	toString: () => "<@222222222>",
	send: jest.fn().mockResolvedValue({}),
	ban: jest.fn().mockResolvedValue({}),
};

describe("PrefixCommand ?ban", () => {
	let message;
	let client;

	beforeEach(() => {
		jest.clearAllMocks();
		BANNED_MEMBER.send = jest.fn().mockResolvedValue({});
		BANNED_MEMBER.ban = jest.fn().mockResolvedValue({});
		BANNED_MEMBER.bannable = true;
		message = createMockMessage({
			content: "?ban @BannedUser",
			mentions: {
				members: { first: jest.fn().mockReturnValue(BANNED_MEMBER) },
			},
			member: {
				id: "123456789",
				toString: () => "<@123456789>",
			},
			guild: {
				id: "987654321",
				name: "Test Server",
				members: { cache: { get: jest.fn().mockReturnValue(BANNED_MEMBER) } },
			},
			channel: {
				send: jest.fn().mockResolvedValue({}),
				guild: { name: "Test Server", toString: () => "Test Server" },
			},
		});
		client = createMockClient();
	});

	describe("Command structure", () => {
		test("has the correct name", () => {
			expect(banCommand.name).toBe("ban");
		});

		test("has aliases including 'banish'", () => {
			expect(Array.isArray(banCommand.aliases)).toBe(true);
			expect(banCommand.aliases).toContain("banish");
		});

		test("has a description", () => {
			expect(typeof banCommand.description).toBe("string");
			expect(banCommand.description.length).toBeGreaterThan(0);
		});

		test("has an execute function", () => {
			expect(typeof banCommand.execute).toBe("function");
		});

		test("is not usable in DMs", () => {
			expect(banCommand.usableInDms).toBe(false);
		});

		test("requires BanMembers permission", () => {
			expect(banCommand.permissions).toContain(PermissionFlagsBits.BanMembers);
		});
	});

	describe("Successful ban", () => {
		test("calls member.ban on the resolved member", async () => {
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			expect(BANNED_MEMBER.ban).toHaveBeenCalledTimes(1);
		});

		test("sends a DM to the banned user", async () => {
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			expect(BANNED_MEMBER.send).toHaveBeenCalledTimes(1);
		});

		test("DM contains an embed", async () => {
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			const dmArgs = BANNED_MEMBER.send.mock.calls[0][0];
			expect(dmArgs.embeds).toBeDefined();
			expect(dmArgs.embeds.length).toBeGreaterThan(0);
		});

		test("sends a success embed to the channel", async () => {
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			expect(message.channel.send).toHaveBeenCalledTimes(1);
			const callArgs = message.channel.send.mock.calls[0][0];
			expect(callArgs.embeds).toBeDefined();
			expect(callArgs.embeds.length).toBeGreaterThan(0);
		});

		test("success embed contains a User field", async () => {
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			const userField = embed.data.fields.find((f) => f.name === "User");
			expect(userField).toBeDefined();
		});

		test("success embed contains a Reason field", async () => {
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField).toBeDefined();
		});

		test("uses default reason when no reason is provided", async () => {
			await banCommand.execute(message, client, ["?ban"]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField.value).toContain("No reason provided");
		});

		test("uses the provided reason when one is given", async () => {
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id, "Spamming", "links"]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField.value).toContain("Spamming links");
		});

		test("success embed author includes devBy config", async () => {
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			expect(embed.data.author.name).toContain(client.config.devBy);
		});

		test("success embed footer mentions the ban hammer", async () => {
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			expect(embed.data.footer.text).toContain("ban hammer");
		});
	});

	describe("Missing user guard", () => {
		test("sends a content error when no user is mentioned", async () => {
			message.mentions.members.first = jest.fn().mockReturnValue(undefined);
			message.guild.members.cache.get = jest.fn().mockReturnValue(undefined);
			await banCommand.execute(message, client, ["?ban"]);
			expect(message.channel.send).toHaveBeenCalledTimes(1);
			const response = message.channel.send.mock.calls[0][0];
			expect(response.content).toBeTruthy();
		});

		test("error message tells the user to mention someone", async () => {
			message.mentions.members.first = jest.fn().mockReturnValue(undefined);
			message.guild.members.cache.get = jest.fn().mockReturnValue(undefined);
			await banCommand.execute(message, client, ["?ban"]);
			const response = message.channel.send.mock.calls[0][0];
			expect(response.content).toContain("mention");
		});

		test("does not call member.ban when no user is found", async () => {
			message.mentions.members.first = jest.fn().mockReturnValue(undefined);
			message.guild.members.cache.get = jest.fn().mockReturnValue(undefined);
			await banCommand.execute(message, client, ["?ban"]);
			expect(BANNED_MEMBER.ban).not.toHaveBeenCalled();
		});
	});

	describe("Non-bannable member", () => {
		test("sends a failure embed when the member cannot be banned", async () => {
			BANNED_MEMBER.bannable = false;
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			expect(message.channel.send).toHaveBeenCalledTimes(1);
			const callArgs = message.channel.send.mock.calls[0][0];
			expect(callArgs.embeds).toBeDefined();
			expect(callArgs.embeds.length).toBeGreaterThan(0);
		});

		test("failure embed description mentions the failed ban", async () => {
			BANNED_MEMBER.bannable = false;
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			expect(embed.data.description).toContain("Failed to ban");
		});

		test("does not call member.ban when the member is not bannable", async () => {
			BANNED_MEMBER.bannable = false;
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			expect(BANNED_MEMBER.ban).not.toHaveBeenCalled();
		});

		test("does not send a DM when the member is not bannable", async () => {
			BANNED_MEMBER.bannable = false;
			await banCommand.execute(message, client, ["?ban", BANNED_MEMBER.id]);
			expect(BANNED_MEMBER.send).not.toHaveBeenCalled();
		});
	});
});
