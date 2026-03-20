const { createMockInteraction, createMockClient } = require("../../../../mocks/discordMocks.js");
const kickCommand = require("../../../../../src/commands/SlashCommands/Moderation/kick.slash.js");
const { PermissionFlagsBits } = require("discord.js");

const KICKED_USER = {
	id: "222222222",
	tag: "KickedUser#0001",
	avatarURL: jest.fn().mockReturnValue("https://example.com/kicked-avatar.png"),
};

const KICKED_MEMBER = {
	id: "222222222",
	send: jest.fn().mockResolvedValue({}),
	kick: jest.fn().mockResolvedValue({}),
};

describe("SlashCommand /kick", () => {
	let interaction;
	let client;

	beforeEach(() => {
		jest.clearAllMocks();
		KICKED_MEMBER.send = jest.fn().mockResolvedValue({});
		KICKED_MEMBER.kick = jest.fn().mockResolvedValue({});
		interaction = createMockInteraction({
			member: { id: "123456789" },
			guild: {
				id: "987654321",
				name: "Test Server",
			},
			options: {
				getUser: jest.fn().mockReturnValue(KICKED_USER),
				getMember: jest.fn().mockReturnValue(KICKED_MEMBER),
				getString: jest.fn().mockReturnValue(null),
			},
		});
		client = createMockClient();
	});

	describe("Command structure", () => {
		test("has a data property with the correct name", () => {
			expect(kickCommand.data).toBeDefined();
			expect(kickCommand.data.name).toBe("kick");
		});

		test("has a description", () => {
			expect(kickCommand.data.description).toBeTruthy();
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
		test("calls kickedMember.kick once", async () => {
			await kickCommand.execute(interaction, client);
			expect(KICKED_MEMBER.kick).toHaveBeenCalledTimes(1);
		});

		test("sends a DM to the kicked user", async () => {
			await kickCommand.execute(interaction, client);
			expect(KICKED_MEMBER.send).toHaveBeenCalledTimes(1);
		});

		test("DM contains an embed", async () => {
			await kickCommand.execute(interaction, client);
			const dmArgs = KICKED_MEMBER.send.mock.calls[0][0];
			expect(dmArgs.embeds).toBeDefined();
			expect(dmArgs.embeds.length).toBeGreaterThan(0);
		});

		test("replies with a success embed", async () => {
			await kickCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
			const replyArgs = interaction.reply.mock.calls[0][0];
			expect(replyArgs.embeds).toBeDefined();
			expect(replyArgs.embeds.length).toBeGreaterThan(0);
		});

		test("success embed contains a User field with the kicked user's tag", async () => {
			await kickCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const userField = embed.data.fields.find((f) => f.name === "User");
			expect(userField).toBeDefined();
			expect(userField.value).toContain(KICKED_USER.tag);
		});

		test("success embed contains a Reason field", async () => {
			await kickCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField).toBeDefined();
		});

		test("uses the default reason when none is provided", async () => {
			await kickCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField.value).toContain("Reason for kick not given");
		});

		test("uses the provided reason when one is given", async () => {
			interaction.options.getString = jest.fn().mockReturnValue("Spamming");
			await kickCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const reasonField = embed.data.fields.find((f) => f.name === "Reason");
			expect(reasonField.value).toContain("Spamming");
		});

		test("success embed author includes devBy config", async () => {
			await kickCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.author.name).toContain(client.config.devBy);
		});

		test("success embed footer mentions being kicked", async () => {
			await kickCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.footer.text).toContain("kicked");
		});
	});

	describe("Self-kick guard", () => {
		test("replies ephemerally when the executor targets themselves", async () => {
			interaction.member.id = KICKED_USER.id;
			await kickCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
			const replyArgs = interaction.reply.mock.calls[0][0];
			expect(replyArgs.content).toContain("cannot");
			expect(replyArgs.flags).toBeDefined();
		});

		test("does not call member.kick when the executor targets themselves", async () => {
			interaction.member.id = KICKED_USER.id;
			await kickCommand.execute(interaction, client);
			expect(KICKED_MEMBER.kick).not.toHaveBeenCalled();
		});
	});

	describe("Bot-kick guard", () => {
		test("replies ephemerally when the executor targets the bot", async () => {
			interaction.options.getUser = jest.fn().mockReturnValue({ ...KICKED_USER, id: client.user.id });
			await kickCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
			const replyArgs = interaction.reply.mock.calls[0][0];
			expect(replyArgs.content).toContain("cannot");
			expect(replyArgs.flags).toBeDefined();
		});

		test("does not call member.kick when the target is the bot", async () => {
			interaction.options.getUser = jest.fn().mockReturnValue({ ...KICKED_USER, id: client.user.id });
			await kickCommand.execute(interaction, client);
			expect(KICKED_MEMBER.kick).not.toHaveBeenCalled();
		});
	});

	describe("Member not in server guard", () => {
		test("replies ephemerally when the member is not in the server", async () => {
			interaction.options.getMember = jest.fn().mockReturnValue(null);
			await kickCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
			const replyArgs = interaction.reply.mock.calls[0][0];
			expect(replyArgs.content).toContain("does not");
			expect(replyArgs.flags).toBeDefined();
		});

		test("does not call member.kick when the member is not found", async () => {
			interaction.options.getMember = jest.fn().mockReturnValue(null);
			await kickCommand.execute(interaction, client);
			expect(KICKED_MEMBER.kick).not.toHaveBeenCalled();
		});
	});
});
