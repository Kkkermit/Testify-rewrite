const { createMockClient, createMockSubcommandInteraction } = require("../../../../mocks/discordMocks.js");
const prefixCommand = require("../../../../../src/commands/SlashCommands/Admin/prefixSettings.slash.js");

const mockPrefixSystem = global.mockSchemas.prefixSystem;

const enabledDoc = { Guild: "987654321", Prefix: "!", Enabled: true };
const disabledDoc = { Guild: "987654321", Prefix: "?", Enabled: false };

describe("SlashCommand /prefix", () => {
	let client;

	beforeEach(() => {
		client = createMockClient();
		jest.clearAllMocks();
	});

	describe("Command structure", () => {
		test('has a data property with name "prefix"', () => {
			expect(prefixCommand.data).toBeDefined();
			expect(prefixCommand.data.name).toBe("prefix");
		});

		test("has a description", () => {
			expect(prefixCommand.data.description).toBeTruthy();
		});

		test("has an execute function", () => {
			expect(typeof prefixCommand.execute).toBe("function");
		});

		test("usableInDms is false", () => {
			expect(prefixCommand.usableInDms).toBe(false);
		});

		test("requires Administrator permission", () => {
			expect(prefixCommand.permissions).toBeDefined();
			expect(prefixCommand.permissions.length).toBeGreaterThan(0);
		});
	});

	describe("prefix system not enabled guard", () => {
		test('replies ephemerally when guildData is null and sub is "change"', async () => {
			mockPrefixSystem.findOne.mockResolvedValueOnce(null);
			const interaction = createMockSubcommandInteraction("change");
			await prefixCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.flags).toBeDefined();
			expect(arg.content).toContain("prefix enable");
		});

		test('replies ephemerally when guildData.Enabled is false and sub is "change"', async () => {
			mockPrefixSystem.findOne.mockResolvedValueOnce(disabledDoc);
			const interaction = createMockSubcommandInteraction("change");
			await prefixCommand.execute(interaction, client);
			expect(interaction.reply).toHaveBeenCalledTimes(1);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.flags).toBeDefined();
		});

		test('does NOT block "enable" subcommand when system is not enabled', async () => {
			mockPrefixSystem.findOne.mockResolvedValueOnce(null);
			const interaction = createMockSubcommandInteraction("enable", { boolean: true, string: "!" });
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.content).toBeUndefined();
		});

		test('does NOT block "disable" subcommand when system is not enabled', async () => {
			mockPrefixSystem.findOne.mockResolvedValueOnce(null);
			const interaction = createMockSubcommandInteraction("disable");
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.content).toContain("already **disabled**");
		});

		test('does NOT block "check" subcommand when system is not enabled', async () => {
			mockPrefixSystem.findOne.mockResolvedValueOnce(null);
			const interaction = createMockSubcommandInteraction("check");
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.embeds).toBeDefined();
			expect(arg.content).toBeUndefined();
		});
	});

	describe("subcommand: change", () => {
		beforeEach(() => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			mockPrefixSystem.findOneAndUpdate.mockResolvedValue(enabledDoc);
		});

		test("replies with an embed on success", async () => {
			const interaction = createMockSubcommandInteraction("change", { string: "!" });
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.embeds).toBeDefined();
			expect(arg.embeds.length).toBeGreaterThan(0);
		});

		test("reply is ephemeral on success", async () => {
			const interaction = createMockSubcommandInteraction("change", { string: "!" });
			await prefixCommand.execute(interaction, client);
			expect(interaction.reply.mock.calls[0][0].flags).toBeDefined();
		});

		test("calls findOneAndUpdate with the new prefix", async () => {
			const interaction = createMockSubcommandInteraction("change", { string: "!" });
			await prefixCommand.execute(interaction, client);
			expect(mockPrefixSystem.findOneAndUpdate).toHaveBeenCalledWith(
				{ Guild: interaction.guild.id },
				{ Prefix: "!" },
				{ upsert: true, returnDocument: "after" },
			);
		});

		test("rejects prefix longer than 4 characters", async () => {
			const interaction = createMockSubcommandInteraction("change", { string: "toolong" });
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.content).toContain("cannot** be longer than 4 characters");
			expect(mockPrefixSystem.findOneAndUpdate).not.toHaveBeenCalled();
		});

		test("embed description contains the new prefix", async () => {
			const interaction = createMockSubcommandInteraction("change", { string: ">" });
			await prefixCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.description).toContain(">");
		});

		test("replies with error message when findOneAndUpdate throws", async () => {
			mockPrefixSystem.findOneAndUpdate.mockRejectedValueOnce(new Error("db error"));
			const interaction = createMockSubcommandInteraction("change", { string: "!" });
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.content).toContain("something went wrong");
		});
	});

	describe("subcommand: check", () => {
		test("replies with an embed showing the current prefix", async () => {
			mockPrefixSystem.findOne.mockResolvedValueOnce(enabledDoc);
			const interaction = createMockSubcommandInteraction("check");
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.embeds).toBeDefined();
			expect(arg.embeds[0].data.description).toContain("!");
		});

		test("shows defaultPrefix when system has never been set up (no db record)", async () => {
			mockPrefixSystem.findOne.mockResolvedValueOnce(null);
			const interaction = createMockSubcommandInteraction("check");
			await prefixCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.description).toContain(client.config.defaultPrefix);
		});

		test("shows defaultPrefix when system is disabled", async () => {
			mockPrefixSystem.findOne.mockResolvedValueOnce(disabledDoc);
			const interaction = createMockSubcommandInteraction("check");
			await prefixCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.description).toContain(client.config.defaultPrefix);
		});

		test("reply is NOT ephemeral (visible to everyone)", async () => {
			mockPrefixSystem.findOne.mockResolvedValueOnce(enabledDoc);
			const interaction = createMockSubcommandInteraction("check");
			await prefixCommand.execute(interaction, client);
			expect(interaction.reply.mock.calls[0][0].flags).toBeUndefined();
		});

		test("only calls findOne once (no redundant second query)", async () => {
			mockPrefixSystem.findOne.mockResolvedValueOnce(enabledDoc);
			const interaction = createMockSubcommandInteraction("check");
			await prefixCommand.execute(interaction, client);
			expect(mockPrefixSystem.findOne).toHaveBeenCalledTimes(1);
		});

		test("replies with error message when findOne throws", async () => {
			mockPrefixSystem.findOne.mockRejectedValueOnce(new Error("db"));
			const interaction = createMockSubcommandInteraction("check");
			await prefixCommand.execute(interaction, client);
			expect(interaction.reply.mock.calls[0][0].content).toContain("something went wrong");
		});
	});

	describe("subcommand: reset", () => {
		test("replies with an embed on successful reset", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			mockPrefixSystem.findOneAndUpdate.mockResolvedValue(enabledDoc);
			const interaction = createMockSubcommandInteraction("reset");
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.embeds).toBeDefined();
			expect(arg.embeds.length).toBeGreaterThan(0);
		});

		test("embed description contains the default prefix", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			const interaction = createMockSubcommandInteraction("reset");
			await prefixCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			expect(embed.data.description).toContain(client.config.defaultPrefix);
		});

		test("calls findOneAndUpdate with the default prefix", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			const interaction = createMockSubcommandInteraction("reset");
			await prefixCommand.execute(interaction, client);
			expect(mockPrefixSystem.findOneAndUpdate).toHaveBeenCalledWith(
				{ Guild: interaction.guild.id },
				{ Prefix: client.config.defaultPrefix },
			);
		});

		test("tells user prefix is already default when no guildData exists", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			const interaction = createMockSubcommandInteraction("reset");
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.content ?? "").not.toContain("already set to the");
		});

		test("replies with error message when findOneAndUpdate throws on reset", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			mockPrefixSystem.findOneAndUpdate.mockRejectedValueOnce(new Error("db error"));
			const interaction = createMockSubcommandInteraction("reset");
			await prefixCommand.execute(interaction, client);
			expect(interaction.reply.mock.calls[0][0].content).toContain("something went wrong");
		});
	});

	describe("subcommand: enable", () => {
		beforeEach(() => {
			mockPrefixSystem.findOne.mockResolvedValue(null);
			mockPrefixSystem.findOneAndUpdate.mockResolvedValue({});
		});

		test("replies with an embed when successfully enabled", async () => {
			const interaction = createMockSubcommandInteraction("enable", { boolean: true, string: "!" });
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.embeds).toBeDefined();
			expect(arg.embeds.length).toBeGreaterThan(0);
		});

		test("reply is NOT ephemeral so the server can see it", async () => {
			const interaction = createMockSubcommandInteraction("enable", { boolean: true, string: "!" });
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.flags).toBeUndefined();
		});

		test("calls findOneAndUpdate with Enabled: true and the custom prefix", async () => {
			const interaction = createMockSubcommandInteraction("enable", { boolean: true, string: ">" });
			await prefixCommand.execute(interaction, client);
			expect(mockPrefixSystem.findOneAndUpdate).toHaveBeenCalledWith(
				{ Guild: interaction.guild.id },
				{ Prefix: ">", Enabled: true },
				{ upsert: true, returnDocument: "after" },
			);
		});

		test("uses defaultPrefix when no prefix option is provided", async () => {
			const interaction = createMockSubcommandInteraction("enable", { boolean: true, string: null });
			await prefixCommand.execute(interaction, client);
			expect(mockPrefixSystem.findOneAndUpdate).toHaveBeenCalledWith(
				{ Guild: interaction.guild.id },
				{ Prefix: client.config.defaultPrefix, Enabled: true },
				{ upsert: true, returnDocument: "after" },
			);
		});

		test("replies ephemerally when enable option is false", async () => {
			const interaction = createMockSubcommandInteraction("enable", { boolean: false });
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.flags).toBeDefined();
			expect(arg.content).toContain("won't be enabled");
			expect(mockPrefixSystem.findOneAndUpdate).not.toHaveBeenCalled();
		});

		test("rejects prefix longer than 4 characters", async () => {
			const interaction = createMockSubcommandInteraction("enable", { boolean: true, string: "toolong" });
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.content).toContain("cannot** be longer than 4 characters");
			expect(mockPrefixSystem.findOneAndUpdate).not.toHaveBeenCalled();
		});

		test("replies ephemerally when system is already enabled", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			const interaction = createMockSubcommandInteraction("enable", { boolean: true, string: "!" });
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.flags).toBeDefined();
			expect(arg.content).toContain("already **enabled**");
		});

		test('embed has a "Prefix" field containing the chosen prefix', async () => {
			const interaction = createMockSubcommandInteraction("enable", { boolean: true, string: ">" });
			await prefixCommand.execute(interaction, client);
			const embed = interaction.reply.mock.calls[0][0].embeds[0];
			const prefixField = embed.data.fields.find((f) => f.name === "Prefix");
			expect(prefixField).toBeDefined();
			expect(prefixField.value).toContain(">");
		});

		test("replies with error message when findOneAndUpdate throws", async () => {
			mockPrefixSystem.findOneAndUpdate.mockRejectedValueOnce(new Error("db error"));
			const interaction = createMockSubcommandInteraction("enable", { boolean: true, string: "!" });
			await prefixCommand.execute(interaction, client);
			expect(interaction.reply.mock.calls[0][0].content).toContain("something went wrong");
		});
	});

	describe("subcommand: disable", () => {
		test("replies with a success message when system is enabled", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			mockPrefixSystem.findOneAndUpdate.mockResolvedValue({});
			const interaction = createMockSubcommandInteraction("disable");
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.content).toContain("**disabled**");
		});

		test("reply is ephemeral on success", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			const interaction = createMockSubcommandInteraction("disable");
			await prefixCommand.execute(interaction, client);
			expect(interaction.reply.mock.calls[0][0].flags).toBeDefined();
		});

		test("calls findOneAndUpdate with Enabled: false and the default prefix", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			const interaction = createMockSubcommandInteraction("disable");
			await prefixCommand.execute(interaction, client);
			expect(mockPrefixSystem.findOneAndUpdate).toHaveBeenCalledWith(
				{ Guild: interaction.guild.id },
				{ Enabled: false, Prefix: client.config.defaultPrefix },
			);
		});

		test("replies ephemerally when system is already disabled", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(disabledDoc);
			const interaction = createMockSubcommandInteraction("disable");
			await prefixCommand.execute(interaction, client);
			const arg = interaction.reply.mock.calls[0][0];
			expect(arg.flags).toBeDefined();
			expect(arg.content).toContain("already **disabled**");
			expect(mockPrefixSystem.findOneAndUpdate).not.toHaveBeenCalled();
		});

		test("replies with error message when findOneAndUpdate throws", async () => {
			mockPrefixSystem.findOne.mockResolvedValue(enabledDoc);
			mockPrefixSystem.findOneAndUpdate.mockRejectedValueOnce(new Error("db error"));
			const interaction = createMockSubcommandInteraction("disable");
			await prefixCommand.execute(interaction, client);
			expect(interaction.reply.mock.calls[0][0].content).toContain("something went wrong");
		});
	});
});
