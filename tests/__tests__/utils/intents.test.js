const { GatewayIntentBits, Partials } = require("discord.js");
const { gatewayIntentBits, partials } = require("../../../src/utils/intents");

describe("intents.js", () => {
	describe("gatewayIntentBits", () => {
		test("is an array", () => {
			expect(Array.isArray(gatewayIntentBits)).toBe(true);
		});

		test("is not empty", () => {
			expect(gatewayIntentBits.length).toBeGreaterThan(0);
		});

		test("contains only valid GatewayIntentBits values", () => {
			const validValues = Object.values(GatewayIntentBits);
			gatewayIntentBits.forEach((intent) => {
				expect(validValues).toContain(intent);
			});
		});

		test("has no duplicate intents", () => {
			const unique = new Set(gatewayIntentBits);
			expect(unique.size).toBe(gatewayIntentBits.length);
		});

		test("contains required core intents", () => {
			expect(gatewayIntentBits).toContain(GatewayIntentBits.Guilds);
			expect(gatewayIntentBits).toContain(GatewayIntentBits.GuildMessages);
			expect(gatewayIntentBits).toContain(GatewayIntentBits.MessageContent);
			expect(gatewayIntentBits).toContain(GatewayIntentBits.GuildMembers);
			expect(gatewayIntentBits).toContain(GatewayIntentBits.GuildModeration);
			expect(gatewayIntentBits).toContain(GatewayIntentBits.AutoModerationConfiguration);
			expect(gatewayIntentBits).toContain(GatewayIntentBits.AutoModerationExecution);
			expect(gatewayIntentBits).toContain(GatewayIntentBits.DirectMessages);
			expect(gatewayIntentBits).toContain(GatewayIntentBits.DirectMessageTyping);
			expect(gatewayIntentBits).toContain(GatewayIntentBits.GuildVoiceStates);
			expect(gatewayIntentBits).toContain(GatewayIntentBits.GuildPresences);
		});
	});

	describe("partials", () => {
		test("is an array", () => {
			expect(Array.isArray(partials)).toBe(true);
		});

		test("is not empty", () => {
			expect(partials.length).toBeGreaterThan(0);
		});

		test("contains only valid Partials values", () => {
			const validValues = Object.values(Partials);
			partials.forEach((partial) => {
				expect(validValues).toContain(partial);
			});
		});

		test("has no duplicate partials", () => {
			const unique = new Set(partials);
			expect(unique.size).toBe(partials.length);
		});

		test("contains required partials", () => {
			expect(partials).toContain(Partials.Message);
			expect(partials).toContain(Partials.Reaction);
			expect(partials).toContain(Partials.Channel);
			expect(partials).toContain(Partials.GuildMember);
			expect(partials).toContain(Partials.User);
			expect(partials).toContain(Partials.ThreadMember);
			expect(partials).toContain(Partials.GuildScheduledEvent);
		});
	});
});
