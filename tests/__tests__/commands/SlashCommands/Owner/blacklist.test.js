const { createMockSubcommandInteraction, createMockClient } = require("../../../../mocks/discordMocks.js");
const blacklistCommand = require("../../../../../src/commands/SlashCommands/Owner/blacklist.slash.js");
const { PermissionFlagsBits } = require("discord.js");

const blacklistSchema = global.mockSchemas.blacklistSystem;

const DEVELOPER_ID = "526853643962679323";
const TARGET_USER_ID = "999999999";

describe("SlashCommand /blacklist", () => {
	let client;

	beforeEach(() => {
		jest.clearAllMocks();
		client = createMockClient();
	});

	describe("Command structure", () => {
		test("has a data property with the correct name", () => {
			expect(blacklistCommand.data).toBeDefined();
			expect(blacklistCommand.data.name).toBe("blacklist");
		});

		test("has a description", () => {
			expect(blacklistCommand.data.description).toBeTruthy();
		});

		test("has an execute function", () => {
			expect(typeof blacklistCommand.execute).toBe("function");
		});

		test("is usable in DMs", () => {
			expect(blacklistCommand.usableInDms).toBe(true);
		});

		test("is devOnly", () => {
			expect(blacklistCommand.devOnly).toBe(true);
		});

		test("requires Administrator permission", () => {
			expect(blacklistCommand.permissions).toContain(PermissionFlagsBits.Administrator);
		});
	});

	describe("/blacklist add", () => {
		function makeAddInteraction(overrides = {}) {
			return createMockSubcommandInteraction(
				"add",
				{ string: TARGET_USER_ID },
				{
					user: { id: DEVELOPER_ID },
					client: {
						user: {
							displayAvatarURL: jest.fn().mockReturnValue("https://example.com/bot-avatar.png"),
						},
					},
					...overrides,
				},
			);
		}

		describe("Developer guard", () => {
			test("replies ephemerally when caller is not a developer", async () => {
				const interaction = makeAddInteraction({ user: { id: "000000000" } });
				await blacklistCommand.execute(interaction, client);
				expect(interaction.reply).toHaveBeenCalledTimes(1);
				const args = interaction.reply.mock.calls[0][0];
				expect(args.flags).toBeDefined();
			});

			test("reply content references the owner-only config message", async () => {
				const interaction = makeAddInteraction({ user: { id: "000000000" } });
				await blacklistCommand.execute(interaction, client);
				expect(interaction.reply.mock.calls[0][0].content).toBeDefined();
			});

			test("does not call blacklistSchema.findOne when caller is not a developer", async () => {
				const interaction = makeAddInteraction({ user: { id: "000000000" } });
				await blacklistCommand.execute(interaction, client);
				expect(blacklistSchema.findOne).not.toHaveBeenCalled();
			});
		});

		describe("Successful add", () => {
			beforeEach(() => {
				blacklistSchema.findOne.mockResolvedValue(null);
				blacklistSchema.create.mockResolvedValue({});
			});

			test("calls blacklistSchema.findOne with the target user ID", async () => {
				const interaction = makeAddInteraction();
				interaction.options.getString = jest
					.fn()
					.mockImplementation((key) => (key === "userid" ? TARGET_USER_ID : null));
				await blacklistCommand.execute(interaction, client);
				expect(blacklistSchema.findOne).toHaveBeenCalledWith({ userId: TARGET_USER_ID });
			});

			test("creates a blacklist entry with the default reason when none is given", async () => {
				const interaction = makeAddInteraction();
				interaction.options.getString = jest
					.fn()
					.mockImplementation((key) => (key === "userid" ? TARGET_USER_ID : null));
				await blacklistCommand.execute(interaction, client);
				expect(blacklistSchema.create).toHaveBeenCalledWith({
					userId: TARGET_USER_ID,
					reason: "No reason provided",
				});
			});

			test("creates a blacklist entry with the provided reason", async () => {
				const interaction = makeAddInteraction();
				interaction.options.getString = jest.fn().mockImplementation((key) => {
					if (key === "userid") return TARGET_USER_ID;
					if (key === "reason") return "Spamming";
					return null;
				});
				await blacklistCommand.execute(interaction, client);
				expect(blacklistSchema.create).toHaveBeenCalledWith({
					userId: TARGET_USER_ID,
					reason: "Spamming",
				});
			});

			test("replies with a success embed", async () => {
				const interaction = makeAddInteraction();
				interaction.options.getString = jest
					.fn()
					.mockImplementation((key) => (key === "userid" ? TARGET_USER_ID : null));
				await blacklistCommand.execute(interaction, client);
				expect(interaction.reply).toHaveBeenCalledTimes(1);
				const args = interaction.reply.mock.calls[0][0];
				expect(args.embeds).toBeDefined();
				expect(args.embeds.length).toBeGreaterThan(0);
			});

			test("success embed description mentions the reason", async () => {
				const interaction = makeAddInteraction();
				interaction.options.getString = jest.fn().mockImplementation((key) => {
					if (key === "userid") return TARGET_USER_ID;
					if (key === "reason") return "Spamming";
					return null;
				});
				await blacklistCommand.execute(interaction, client);
				const embed = interaction.reply.mock.calls[0][0].embeds[0];
				expect(embed.data.description).toContain("Spamming");
			});

			test("success embed author includes devBy config", async () => {
				const interaction = makeAddInteraction();
				interaction.options.getString = jest
					.fn()
					.mockImplementation((key) => (key === "userid" ? TARGET_USER_ID : null));
				await blacklistCommand.execute(interaction, client);
				const embed = interaction.reply.mock.calls[0][0].embeds[0];
				expect(embed.data.author.name).toContain(client.config.devBy);
			});

			test("success embed footer mentions the bot username", async () => {
				const interaction = makeAddInteraction();
				interaction.options.getString = jest
					.fn()
					.mockImplementation((key) => (key === "userid" ? TARGET_USER_ID : null));
				await blacklistCommand.execute(interaction, client);
				const embed = interaction.reply.mock.calls[0][0].embeds[0];
				expect(embed.data.footer.text).toContain(client.user.username);
			});
		});

		describe("User already blacklisted", () => {
			beforeEach(() => {
				blacklistSchema.findOne.mockResolvedValue({ userId: TARGET_USER_ID, reason: "Prior offence" });
			});

			test("replies ephemerally with an error embed", async () => {
				const interaction = makeAddInteraction();
				interaction.options.getString = jest
					.fn()
					.mockImplementation((key) => (key === "userid" ? TARGET_USER_ID : null));
				await blacklistCommand.execute(interaction, client);
				expect(interaction.reply).toHaveBeenCalledTimes(1);
				const args = interaction.reply.mock.calls[0][0];
				expect(args.embeds).toBeDefined();
				expect(args.flags).toBeDefined();
			});

			test("error embed description mentions the duplicate error", async () => {
				const interaction = makeAddInteraction();
				interaction.options.getString = jest
					.fn()
					.mockImplementation((key) => (key === "userid" ? TARGET_USER_ID : null));
				await blacklistCommand.execute(interaction, client);
				const embed = interaction.reply.mock.calls[0][0].embeds[0];
				expect(embed.data.description).toContain("already been blacklisted");
			});

			test("does not call blacklistSchema.create when user is already blacklisted", async () => {
				const interaction = makeAddInteraction();
				interaction.options.getString = jest
					.fn()
					.mockImplementation((key) => (key === "userid" ? TARGET_USER_ID : null));
				await blacklistCommand.execute(interaction, client);
				expect(blacklistSchema.create).not.toHaveBeenCalled();
			});
		});
	});

	describe("/blacklist remove", () => {
		function makeRemoveInteraction(overrides = {}) {
			return createMockSubcommandInteraction(
				"remove",
				{ string: TARGET_USER_ID },
				{
					user: { id: DEVELOPER_ID },
					client: {
						user: {
							displayAvatarURL: jest.fn().mockReturnValue("https://example.com/bot-avatar.png"),
						},
					},
					...overrides,
				},
			);
		}

		describe("Developer guard", () => {
			test("replies ephemerally when caller is not a developer", async () => {
				const interaction = makeRemoveInteraction({ user: { id: "000000000" } });
				await blacklistCommand.execute(interaction, client);
				expect(interaction.reply).toHaveBeenCalledTimes(1);
				const args = interaction.reply.mock.calls[0][0];
				expect(args.flags).toBeDefined();
			});

			test("does not call blacklistSchema.findOne when caller is not a developer", async () => {
				const interaction = makeRemoveInteraction({ user: { id: "000000000" } });
				await blacklistCommand.execute(interaction, client);
				expect(blacklistSchema.findOne).not.toHaveBeenCalled();
			});
		});

		describe("User not blacklisted guard", () => {
			beforeEach(() => {
				blacklistSchema.findOne.mockResolvedValue(null);
			});

			test("replies ephemerally when user is not in the blacklist", async () => {
				const interaction = makeRemoveInteraction();
				await blacklistCommand.execute(interaction, client);
				expect(interaction.reply).toHaveBeenCalledTimes(1);
				const args = interaction.reply.mock.calls[0][0];
				expect(args.flags).toBeDefined();
			});

			test("reply content mentions the user ID", async () => {
				const interaction = makeRemoveInteraction();
				await blacklistCommand.execute(interaction, client);
				const args = interaction.reply.mock.calls[0][0];
				expect(args.content).toContain(TARGET_USER_ID);
			});

			test("does not call blacklistSchema.findOneAndDelete when user is not blacklisted", async () => {
				const interaction = makeRemoveInteraction();
				await blacklistCommand.execute(interaction, client);
				expect(blacklistSchema.findOneAndDelete).not.toHaveBeenCalled();
			});
		});

		describe("Successful remove", () => {
			beforeEach(() => {
				blacklistSchema.findOne.mockResolvedValue({ userId: TARGET_USER_ID, reason: "Spamming" });
				blacklistSchema.findOneAndDelete.mockResolvedValue({});
			});

			test("calls blacklistSchema.findOneAndDelete with the target user ID", async () => {
				const interaction = makeRemoveInteraction();
				await blacklistCommand.execute(interaction, client);
				expect(blacklistSchema.findOneAndDelete).toHaveBeenCalledWith({ userId: TARGET_USER_ID });
			});

			test("replies with a success embed", async () => {
				const interaction = makeRemoveInteraction();
				await blacklistCommand.execute(interaction, client);
				expect(interaction.reply).toHaveBeenCalledTimes(1);
				const args = interaction.reply.mock.calls[0][0];
				expect(args.embeds).toBeDefined();
				expect(args.embeds.length).toBeGreaterThan(0);
			});

			test("success embed description mentions the removed user ID", async () => {
				const interaction = makeRemoveInteraction();
				await blacklistCommand.execute(interaction, client);
				const embed = interaction.reply.mock.calls[0][0].embeds[0];
				expect(embed.data.description).toContain(TARGET_USER_ID);
			});

			test("success embed author includes devBy config", async () => {
				const interaction = makeRemoveInteraction();
				await blacklistCommand.execute(interaction, client);
				const embed = interaction.reply.mock.calls[0][0].embeds[0];
				expect(embed.data.author.name).toContain(client.config.devBy);
			});

			test("success embed footer mentions removal from blacklist", async () => {
				const interaction = makeRemoveInteraction();
				await blacklistCommand.execute(interaction, client);
				const embed = interaction.reply.mock.calls[0][0].embeds[0];
				expect(embed.data.footer.text).toContain("removed from blacklist");
			});
		});

		describe("Database error on remove", () => {
			beforeEach(() => {
				blacklistSchema.findOne.mockResolvedValue({ userId: TARGET_USER_ID, reason: "Spamming" });
				blacklistSchema.findOneAndDelete.mockRejectedValue(new Error("DB failure"));
			});

			test("logs an error when findOneAndDelete throws", async () => {
				const interaction = makeRemoveInteraction();
				await blacklistCommand.execute(interaction, client);
				expect(client.logs.error).toHaveBeenCalledTimes(1);
			});

			test("does not propagate the error to the caller", async () => {
				const interaction = makeRemoveInteraction();
				await expect(blacklistCommand.execute(interaction, client)).resolves.not.toThrow();
			});
		});
	});
});
