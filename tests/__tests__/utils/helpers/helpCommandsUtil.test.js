const {
	getSlashCommandsByCategory,
	getPrefixCommandsByCategory,
	createCommandPages,
	getCategoryEmoji,
} = require("../../../../src/utils/helpers/helpCommandsUtil");
const { SlashCategory, PrefixCategory } = require("../../../../src/utils/helpers/commandCategorys");
const {
	makeSlashCommand,
	makeSubcommandOption,
	makeNonSubcommandOption,
	makePrefixCommand,
	makeCommandClient,
} = require("../../../mocks/commandMocks");

describe("getSlashCommandsByCategory", () => {
	describe("return type", () => {
		test("returns an object", () => {
			expect(typeof getSlashCommandsByCategory(makeCommandClient())).toBe("object");
		});

		test("returns empty object when there are no commands", () => {
			expect(getSlashCommandsByCategory(makeCommandClient())).toEqual({});
		});
	});

	describe("category grouping", () => {
		test("groups a single command under its category", () => {
			const client = makeCommandClient([makeSlashCommand()]);
			const result = getSlashCommandsByCategory(client);
			expect(result[SlashCategory.INFO]).toHaveLength(1);
		});

		test("groups multiple commands under the same category", () => {
			const client = makeCommandClient([
				makeSlashCommand({ data: { name: "a", description: "A", options: [] } }),
				makeSlashCommand({ data: { name: "b", description: "B", options: [] } }),
			]);
			const result = getSlashCommandsByCategory(client);
			expect(result[SlashCategory.INFO]).toHaveLength(2);
		});

		test("groups commands into separate categories", () => {
			const client = makeCommandClient([
				makeSlashCommand({ category: SlashCategory.INFO }),
				makeSlashCommand({ category: SlashCategory.FUN, data: { name: "fun", description: "Fun", options: [] } }),
			]);
			const result = getSlashCommandsByCategory(client);
			expect(result[SlashCategory.INFO]).toHaveLength(1);
			expect(result[SlashCategory.FUN]).toHaveLength(1);
		});

		test("falls back to SlashCategory.MISC when category is not set", () => {
			const client = makeCommandClient([makeSlashCommand({ category: undefined })]);
			const result = getSlashCommandsByCategory(client);
			expect(result[SlashCategory.MISC]).toHaveLength(1);
		});
	});

	describe("owner filter", () => {
		test("excludes commands with Owner category", () => {
			const client = makeCommandClient([makeSlashCommand({ category: SlashCategory.OWNER })]);
			const result = getSlashCommandsByCategory(client);
			expect(result[SlashCategory.OWNER]).toBeUndefined();
		});

		test("still includes non-owner commands when mixed", () => {
			const client = makeCommandClient([
				makeSlashCommand({ category: SlashCategory.OWNER }),
				makeSlashCommand({ category: SlashCategory.INFO }),
			]);
			const result = getSlashCommandsByCategory(client);
			expect(result[SlashCategory.OWNER]).toBeUndefined();
			expect(result[SlashCategory.INFO]).toHaveLength(1);
		});
	});

	describe("command shape", () => {
		test("each entry has the expected keys", () => {
			const client = makeCommandClient([makeSlashCommand()]);
			const [cmd] = getSlashCommandsByCategory(client)[SlashCategory.INFO];
			expect(cmd).toHaveProperty("name");
			expect(cmd).toHaveProperty("description");
			expect(cmd).toHaveProperty("usableInDms");
			expect(cmd).toHaveProperty("underDevelopment");
			expect(cmd).toHaveProperty("subcommands");
		});

		test("maps name and description from command.data", () => {
			const client = makeCommandClient([makeSlashCommand()]);
			const [cmd] = getSlashCommandsByCategory(client)[SlashCategory.INFO];
			expect(cmd.name).toBe("test");
			expect(cmd.description).toBe("A test command");
		});

		test("usableInDms defaults to false", () => {
			const client = makeCommandClient([makeSlashCommand({ usableInDms: undefined })]);
			const [cmd] = getSlashCommandsByCategory(client)[SlashCategory.INFO];
			expect(cmd.usableInDms).toBe(false);
		});

		test("usableInDms is true when set", () => {
			const client = makeCommandClient([makeSlashCommand({ usableInDms: true })]);
			const [cmd] = getSlashCommandsByCategory(client)[SlashCategory.INFO];
			expect(cmd.usableInDms).toBe(true);
		});

		test("underDevelopment defaults to false", () => {
			const client = makeCommandClient([makeSlashCommand({ underDevelopment: undefined })]);
			const [cmd] = getSlashCommandsByCategory(client)[SlashCategory.INFO];
			expect(cmd.underDevelopment).toBe(false);
		});

		test("underDevelopment is true when set", () => {
			const client = makeCommandClient([makeSlashCommand({ underDevelopment: true })]);
			const [cmd] = getSlashCommandsByCategory(client)[SlashCategory.INFO];
			expect(cmd.underDevelopment).toBe(true);
		});
	});

	describe("subcommands", () => {
		test("subcommands is empty array when no options", () => {
			const client = makeCommandClient([makeSlashCommand()]);
			const [cmd] = getSlashCommandsByCategory(client)[SlashCategory.INFO];
			expect(cmd.subcommands).toEqual([]);
		});

		test("extracts subcommands with type === 1", () => {
			const command = makeSlashCommand({
				data: {
					name: "parent",
					description: "Parent",
					options: [makeSubcommandOption("sub1", "Sub 1"), makeSubcommandOption("sub2", "Sub 2")],
				},
			});
			const client = makeCommandClient([command]);
			const [cmd] = getSlashCommandsByCategory(client)[SlashCategory.INFO];
			expect(cmd.subcommands).toHaveLength(2);
			expect(cmd.subcommands[0]).toEqual({ name: "sub1", description: "Sub 1" });
			expect(cmd.subcommands[1]).toEqual({ name: "sub2", description: "Sub 2" });
		});

		test("ignores non-subcommand options (type !== 1)", () => {
			const command = makeSlashCommand({
				data: {
					name: "parent",
					description: "Parent",
					options: [makeNonSubcommandOption("str-opt")],
				},
			});
			const client = makeCommandClient([command]);
			const [cmd] = getSlashCommandsByCategory(client)[SlashCategory.INFO];
			expect(cmd.subcommands).toHaveLength(0);
		});
	});
});

describe("getPrefixCommandsByCategory", () => {
	describe("return type", () => {
		test("returns an object", () => {
			expect(typeof getPrefixCommandsByCategory(makeCommandClient())).toBe("object");
		});

		test("returns empty object when there are no commands", () => {
			expect(getPrefixCommandsByCategory(makeCommandClient())).toEqual({});
		});
	});

	describe("category grouping", () => {
		test("groups a single command under its category", () => {
			const client = makeCommandClient([], [makePrefixCommand()]);
			const result = getPrefixCommandsByCategory(client);
			expect(result[PrefixCategory.INFO]).toHaveLength(1);
		});

		test("groups multiple commands under the same category", () => {
			const client = makeCommandClient([], [makePrefixCommand({ name: "a" }), makePrefixCommand({ name: "b" })]);
			const result = getPrefixCommandsByCategory(client);
			expect(result[PrefixCategory.INFO]).toHaveLength(2);
		});

		test("groups commands into separate categories", () => {
			const client = makeCommandClient(
				[],
				[
					makePrefixCommand({ category: PrefixCategory.INFO }),
					makePrefixCommand({ name: "fun", category: PrefixCategory.FUN }),
				],
			);
			const result = getPrefixCommandsByCategory(client);
			expect(result[PrefixCategory.INFO]).toHaveLength(1);
			expect(result[PrefixCategory.FUN]).toHaveLength(1);
		});

		test("falls back to PrefixCategory.OTHER when category is not set", () => {
			const client = makeCommandClient([], [makePrefixCommand({ category: undefined })]);
			const result = getPrefixCommandsByCategory(client);
			expect(result[PrefixCategory.OTHER]).toHaveLength(1);
		});
	});

	describe("owner filter", () => {
		test("excludes commands with OwnerCommands category", () => {
			const client = makeCommandClient([], [makePrefixCommand({ category: PrefixCategory.OWNER })]);
			const result = getPrefixCommandsByCategory(client);
			expect(result[PrefixCategory.OWNER]).toBeUndefined();
		});

		test("still includes non-owner commands when mixed", () => {
			const client = makeCommandClient(
				[],
				[makePrefixCommand({ category: PrefixCategory.OWNER }), makePrefixCommand({ category: PrefixCategory.INFO })],
			);
			const result = getPrefixCommandsByCategory(client);
			expect(result[PrefixCategory.OWNER]).toBeUndefined();
			expect(result[PrefixCategory.INFO]).toHaveLength(1);
		});
	});

	describe("command shape", () => {
		test("each entry has the expected keys", () => {
			const client = makeCommandClient([], [makePrefixCommand()]);
			const [cmd] = getPrefixCommandsByCategory(client)[PrefixCategory.INFO];
			expect(cmd).toHaveProperty("name");
			expect(cmd).toHaveProperty("description");
			expect(cmd).toHaveProperty("usableInDms");
			expect(cmd).toHaveProperty("underDevelopment");
			expect(cmd).toHaveProperty("aliases");
			expect(cmd).toHaveProperty("subcommands");
		});

		test("maps name and description from command", () => {
			const client = makeCommandClient([], [makePrefixCommand()]);
			const [cmd] = getPrefixCommandsByCategory(client)[PrefixCategory.INFO];
			expect(cmd.name).toBe("ptest");
			expect(cmd.description).toBe("A prefix test command");
		});

		test("falls back to 'No description provided' when description is missing", () => {
			const client = makeCommandClient([], [makePrefixCommand({ description: undefined })]);
			const [cmd] = getPrefixCommandsByCategory(client)[PrefixCategory.INFO];
			expect(cmd.description).toBe("No description provided");
		});

		test("aliases defaults to empty array", () => {
			const client = makeCommandClient([], [makePrefixCommand({ aliases: undefined })]);
			const [cmd] = getPrefixCommandsByCategory(client)[PrefixCategory.INFO];
			expect(cmd.aliases).toEqual([]);
		});

		test("aliases are preserved when set", () => {
			const client = makeCommandClient([], [makePrefixCommand({ aliases: ["pt", "pte"] })]);
			const [cmd] = getPrefixCommandsByCategory(client)[PrefixCategory.INFO];
			expect(cmd.aliases).toEqual(["pt", "pte"]);
		});

		test("subcommands defaults to empty array", () => {
			const client = makeCommandClient([], [makePrefixCommand({ subcommands: undefined })]);
			const [cmd] = getPrefixCommandsByCategory(client)[PrefixCategory.INFO];
			expect(cmd.subcommands).toEqual([]);
		});

		test("usableInDms defaults to false", () => {
			const client = makeCommandClient([], [makePrefixCommand({ usableInDms: undefined })]);
			const [cmd] = getPrefixCommandsByCategory(client)[PrefixCategory.INFO];
			expect(cmd.usableInDms).toBe(false);
		});

		test("underDevelopment defaults to false", () => {
			const client = makeCommandClient([], [makePrefixCommand({ underDevelopment: undefined })]);
			const [cmd] = getPrefixCommandsByCategory(client)[PrefixCategory.INFO];
			expect(cmd.underDevelopment).toBe(false);
		});
	});
});

describe("createCommandPages", () => {
	const commands = Array.from({ length: 13 }, (_, i) => ({ name: `cmd${i}` }));

	describe("return type", () => {
		test("returns an array", () => {
			expect(Array.isArray(createCommandPages(commands))).toBe(true);
		});

		test("returns empty array for empty input", () => {
			expect(createCommandPages([])).toEqual([]);
		});
	});

	describe("pagination", () => {
		test("creates one page when commands fit within itemsPerPage", () => {
			expect(createCommandPages(commands.slice(0, 5), 6)).toHaveLength(1);
		});

		test("fills exactly one page when commands equal itemsPerPage", () => {
			expect(createCommandPages(commands.slice(0, 6), 6)).toHaveLength(1);
		});

		test("creates two pages when commands exceed one page", () => {
			expect(createCommandPages(commands.slice(0, 7), 6)).toHaveLength(2);
		});

		test("splits 13 commands into 3 pages with itemsPerPage of 5", () => {
			expect(createCommandPages(commands, 5)).toHaveLength(3);
		});

		test("each page has at most itemsPerPage items", () => {
			const pages = createCommandPages(commands, 5);
			pages.forEach((page) => expect(page.length).toBeLessThanOrEqual(5));
		});

		test("last page contains the remainder", () => {
			const pages = createCommandPages(commands, 5);
			expect(pages[pages.length - 1]).toHaveLength(3);
		});

		test("all commands are present across all pages", () => {
			const pages = createCommandPages(commands, 5);
			const flat = pages.flat();
			expect(flat).toHaveLength(commands.length);
		});

		test("commands appear in the original order", () => {
			const pages = createCommandPages(commands, 5);
			const flat = pages.flat();
			flat.forEach((cmd, i) => expect(cmd.name).toBe(`cmd${i}`));
		});

		test("defaults to 6 items per page", () => {
			const pages = createCommandPages(commands);
			expect(pages[0]).toHaveLength(6);
			expect(pages[1]).toHaveLength(6);
			expect(pages[2]).toHaveLength(1);
		});
	});
});

describe("getCategoryEmoji", () => {
	describe("slash categories", () => {
		test.each([
			[SlashCategory.INFO, "📚"],
			[SlashCategory.COMMUNITY, "👥"],
			[SlashCategory.ADMIN, "🛡️"],
			[SlashCategory.FUN, "🎮"],
			[SlashCategory.ECONOMY, "💰"],
			[SlashCategory.AI, "🤖"],
			[SlashCategory.MISC, "🔧"],
			[SlashCategory.PREFIX_SETTINGS, "🔤"],
			[SlashCategory.LEVEL_SYSTEM, "📈"],
			[SlashCategory.LEVEL_AND_ECONOMY, "💹"],
			[SlashCategory.MINI_GAMES, "🎯"],
			[SlashCategory.AUTOMOD, "⚙️"],
			[SlashCategory.DEVS, "👨‍💻"],
			[SlashCategory.GIVEAWAY, "🎁"],
		])("%s → %s", (category, expected) => {
			expect(getCategoryEmoji(category)).toBe(expected);
		});
	});

	describe("prefix categories", () => {
		test.each([
			[PrefixCategory.MODERATION, "🛡️"],
			[PrefixCategory.MUSIC, "🎵"],
			[PrefixCategory.UTILITY, "🔧"],
			[PrefixCategory.LEVEL, "📈"],
			[PrefixCategory.OTHER, "❓"],
		])("%s → %s", (category, expected) => {
			expect(getCategoryEmoji(category)).toBe(expected);
		});
	});

	describe("unknown category", () => {
		test("returns 📌 for an unrecognised category string", () => {
			expect(getCategoryEmoji("SomeRandomCategory")).toBe("📌");
		});

		test("returns 📌 for undefined", () => {
			expect(getCategoryEmoji(undefined)).toBe("📌");
		});

		test("returns 📌 for empty string", () => {
			expect(getCategoryEmoji("")).toBe("📌");
		});
	});

	describe("return type", () => {
		test("always returns a string", () => {
			expect(typeof getCategoryEmoji(SlashCategory.INFO)).toBe("string");
			expect(typeof getCategoryEmoji("unknown")).toBe("string");
		});
	});
});
