const { createMockMessage, createMockClient } = require("../../../../mocks/discordMocks.js");
const kickCommand = require("../../../../../src/commands/PrefixCommands/Moderation/kick.prefix.js");
const { PermissionFlagsBits } = require("discord.js");

const KICKED_MEMBER = {
	id: "222222222",
	tag: "KickedUser#0001",
	kickable: true,
	toString: () => "<@222222222>",
	avatarURL: jest.fn().mockReturnValue("https://example.com/kicked-avatar.png"),
	send: jest.fn().mockResolvedValue({}),
	kick: jest.fn().mockResolvedValue({}),
};

describe("PrefixCommand ?kick", () => {
	let message;
	let client;

	beforeEach(() => {
		jest.clearAllMocks();
		KICKED_MEMBER.id = "222222222";
		KICKED_MEMBER.send = jest.fn().mockResolvedValue({});
		KICKED_MEMBER.kick = jest.fn().mockResolvedValue({});
		KICKED_MEMBER.kickable = true;
		message = createMockMessage({
			content: "?kick @KickedUser",
			mentions: {
				members: { first: jest.fn().mockReturnValue(KICKED_MEMBER) },
			},
			member: {
				id: "123456789",
				toString: () => "<@123456789>",
			},
			guild: {
				id: "987654321",
				name: "Test Server",
				members: {
					cache: {
						get: jest.fn().mockReturnValue(KICKED_MEMBER),
						has: jest.fn().mockReturnValue(true),
					},
				},
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
			expect(kickCommand.name).toBe("kick");
		});

		test("has aliases including 'boot'", () => {
			expect(Array.isArray(kickCommand.aliases)).toBe(true);
			expect(kickCommand.aliases).toContain("boot");
		});

		test("has a description", () => {
			expect(typeof kickCommand.description).toBe("string");
			expect(kickCommand.description.length).toBeGreaterThan(0);
		});

		test("has an execute function", () => {
			expect(typeof kickCommand.execute).toBe("function");
		});

		test("is not usable in DMs", () => {
			expect(kickCommand.usableInDms).toBe(false);
		});

		test("requires KickMembers permission", () => {
			expect(kickCommand.permissions).toContain(PermissionFlagsBits.KickMembers);
		});
	});

	describe("Successful kick", () => {
		test("calls member.kick on the resolved member", async () => {
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			expect(KICKED_MEMBER.kick).toHaveBeenCalledTimes(1);
		});

		test("sends a DM to the kicked user", async () => {
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			expect(KICKED_MEMBER.send).toHaveBeenCalledTimes(1);
		});

		test("DM contains an embed", async () => {
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			const dmArgs = KICKED_MEMBER.send.mock.calls[0][0];
			expect(dmArgs.embeds).toBeDefined();
			expect(dmArgs.embeds.length).toBeGreaterThan(0);
		});

		test("sends a success embed to the channel", async () => {
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			expect(message.channel.send).toHaveBeenCalledTimes(1);
			const callArgs = message.channel.send.mock.calls[0][0];
			expect(callArgs.embeds).toBeDefined();
			expect(callArgs.embeds.length).toBeGreaterThan(0);
		});

		test("success embed contains a User field", async () => {
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			const userField = embed.data.fields.find((f) => f.name === "User");
			expect(userField).toBeDefined();
		});

		test("success embed contains a Reason field", async () => {
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField).toBeDefined();
		});

		test("uses default reason when no reason is provided", async () => {
			await kickCommand.execute(message, client, ["?kick"]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField.value).toContain("No reason given");
		});

		test("uses the provided reason when one is given", async () => {
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id, "Breaking", "rules"]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField.value).toContain("Breaking rules");
		});
	});

	describe("Missing user guard", () => {
		test("sends a content error when no user is mentioned", async () => {
			message.mentions.members.first = jest.fn().mockReturnValue(undefined);
			message.guild.members.cache.get = jest.fn().mockReturnValue(undefined);
			await kickCommand.execute(message, client, ["?kick"]);
			expect(message.channel.send).toHaveBeenCalledTimes(1);
			const response = message.channel.send.mock.calls[0][0];
			expect(response.content).toBeTruthy();
		});

		test("error message tells the user to mention someone", async () => {
			message.mentions.members.first = jest.fn().mockReturnValue(undefined);
			message.guild.members.cache.get = jest.fn().mockReturnValue(undefined);
			await kickCommand.execute(message, client, ["?kick"]);
			const response = message.channel.send.mock.calls[0][0];
			expect(response.content).toContain("mention");
		});

		test("does not call member.kick when no user is found", async () => {
			message.mentions.members.first = jest.fn().mockReturnValue(undefined);
			message.guild.members.cache.get = jest.fn().mockReturnValue(undefined);
			await kickCommand.execute(message, client, ["?kick"]);
			expect(KICKED_MEMBER.kick).not.toHaveBeenCalled();
		});
	});

	describe("Self-kick guard", () => {
		test("sends an error when the executor tries to kick themselves", async () => {
			message.member.id = KICKED_MEMBER.id;
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			expect(message.channel.send).toHaveBeenCalledTimes(1);
			expect(message.channel.send.mock.calls[0][0].content).toContain("cannot");
		});

		test("does not call member.kick when the executor targets themselves", async () => {
			message.member.id = KICKED_MEMBER.id;
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			expect(KICKED_MEMBER.kick).not.toHaveBeenCalled();
		});
	});

	describe("Bot-kick guard", () => {
		test("sends an error when the executor tries to kick the bot", async () => {
			KICKED_MEMBER.id = client.user.id;
			message.guild.members.cache.get = jest.fn().mockReturnValue(KICKED_MEMBER);
			await kickCommand.execute(message, client, ["?kick", client.user.id]);
			expect(message.channel.send).toHaveBeenCalledTimes(1);
			expect(message.channel.send.mock.calls[0][0].content).toContain("cannot");
		});

		test("does not call member.kick when the target is the bot", async () => {
			KICKED_MEMBER.id = client.user.id;
			message.guild.members.cache.get = jest.fn().mockReturnValue(KICKED_MEMBER);
			await kickCommand.execute(message, client, ["?kick", client.user.id]);
			expect(KICKED_MEMBER.kick).not.toHaveBeenCalled();
		});
	});

	describe("Non-kickable member", () => {
		test("sends a failure embed when the member cannot be kicked", async () => {
			KICKED_MEMBER.kickable = false;
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			expect(message.channel.send).toHaveBeenCalledTimes(1);
			const callArgs = message.channel.send.mock.calls[0][0];
			expect(callArgs.embeds).toBeDefined();
			expect(callArgs.embeds.length).toBeGreaterThan(0);
		});

		test("failure embed description mentions the failed kick", async () => {
			KICKED_MEMBER.kickable = false;
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			const embed = message.channel.send.mock.calls[0][0].embeds[0];
			expect(embed.data.description).toContain("Failed to kick");
		});

		test("does not call member.kick when the member is not kickable", async () => {
			KICKED_MEMBER.kickable = false;
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			expect(KICKED_MEMBER.kick).not.toHaveBeenCalled();
		});

		test("does not send a DM when the member is not kickable", async () => {
			KICKED_MEMBER.kickable = false;
			await kickCommand.execute(message, client, ["?kick", KICKED_MEMBER.id]);
			expect(KICKED_MEMBER.send).not.toHaveBeenCalled();
		});
	});
});
