const config = require("../../../../src/config");
const { getGuildPrefix } = require("../../../../src/utils/helpers/getGuildPrefix.util");

const mockPrefixSystem = global.mockSchemas.prefixSystem;

describe("getGuildPrefix", () => {
	afterEach(() => jest.clearAllMocks());

	describe("no guildId provided", () => {
		test("returns defaultPrefix when guildId is null", async () => {
			expect(await getGuildPrefix(null)).toBe(config.defaultPrefix);
		});

		test("returns defaultPrefix when guildId is undefined", async () => {
			expect(await getGuildPrefix(undefined)).toBe(config.defaultPrefix);
		});

		test("returns defaultPrefix when guildId is empty string", async () => {
			expect(await getGuildPrefix("")).toBe(config.defaultPrefix);
		});

		test("does not query the database when guildId is falsy", async () => {
			await getGuildPrefix(null);
			expect(mockPrefixSystem.findOne).not.toHaveBeenCalled();
		});
	});

	describe("database returns an enabled record with a custom prefix", () => {
		beforeEach(() => {
			mockPrefixSystem.findOne.mockResolvedValue({ Enabled: true, Prefix: "!" });
		});

		test("returns the custom prefix", async () => {
			expect(await getGuildPrefix("123")).toBe("!");
		});

		test("queries the database with the correct guild ID", async () => {
			await getGuildPrefix("123");
			expect(mockPrefixSystem.findOne).toHaveBeenCalledWith({ Guild: "123" });
		});

		test("queries the database exactly once", async () => {
			await getGuildPrefix("123");
			expect(mockPrefixSystem.findOne).toHaveBeenCalledTimes(1);
		});
	});

	describe("database returns a record with Enabled: false", () => {
		beforeEach(() => {
			mockPrefixSystem.findOne.mockResolvedValue({ Enabled: false, Prefix: "!" });
		});

		test("falls back to defaultPrefix when system is disabled", async () => {
			expect(await getGuildPrefix("123")).toBe(config.defaultPrefix);
		});
	});

	describe("database returns a record with no Prefix set", () => {
		beforeEach(() => {
			mockPrefixSystem.findOne.mockResolvedValue({ Enabled: true, Prefix: null });
		});

		test("falls back to defaultPrefix when Prefix is null", async () => {
			expect(await getGuildPrefix("123")).toBe(config.defaultPrefix);
		});
	});

	describe("database returns null (no record exists)", () => {
		beforeEach(() => {
			mockPrefixSystem.findOne.mockResolvedValue(null);
		});

		test("falls back to defaultPrefix when no record exists", async () => {
			expect(await getGuildPrefix("123")).toBe(config.defaultPrefix);
		});
	});

	describe("database throws an error", () => {
		beforeEach(() => {
			mockPrefixSystem.findOne.mockRejectedValue(new Error("DB connection failed"));
		});

		test("falls back to defaultPrefix on a database error", async () => {
			expect(await getGuildPrefix("123")).toBe(config.defaultPrefix);
		});

		test("does not throw when the database errors", async () => {
			await expect(getGuildPrefix("123")).resolves.not.toThrow();
		});
	});

	describe("return type", () => {
		test("always returns a string", async () => {
			expect(typeof (await getGuildPrefix(null))).toBe("string");
			expect(typeof (await getGuildPrefix("123"))).toBe("string");
		});
	});
});
