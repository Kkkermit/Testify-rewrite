const { createMockMessage, createMockClient } = require("../../../../mocks/discordMocks.js");
const adviceCommand = require("../../../../../src/commands/PrefixCommands/Community/advice.js");

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockAdviceResponse = { slip: { id: 1, advice: "Keep it simple." } };

describe("PrefixCommand ?advice", () => {
	let message;
	let client;

	beforeEach(() => {
		message = createMockMessage({ content: "?advice" });
		client = createMockClient();

		mockFetch.mockResolvedValue({
			json: jest.fn().mockResolvedValue(mockAdviceResponse),
		});
	});

	afterEach(() => jest.clearAllMocks());

	describe("command structure", () => {
		test("has the correct name", () => {
			expect(adviceCommand.name).toBe("advice");
		});

		test("has a description", () => {
			expect(typeof adviceCommand.description).toBe("string");
			expect(adviceCommand.description.length).toBeGreaterThan(0);
		});

		test("is usable in DMs", () => {
			expect(adviceCommand.usableInDms).toBe(true);
		});

		test("has an execute function", () => {
			expect(typeof adviceCommand.execute).toBe("function");
		});
	});

	describe("command behavior", () => {
		test("fetches from the advice slip API", async () => {
			await adviceCommand.execute(message, client);
			expect(mockFetch).toHaveBeenCalledWith("https://api.adviceslip.com/advice");
		});

		test("calls message.reply once on success", async () => {
			await adviceCommand.execute(message, client);
			expect(message.reply).toHaveBeenCalledTimes(1);
		});

		test("reply includes an embed on success", async () => {
			await adviceCommand.execute(message, client);
			const callArgs = message.reply.mock.calls[0][0];
			expect(callArgs.embeds).toBeDefined();
			expect(callArgs.embeds.length).toBeGreaterThan(0);
		});
	});

	describe("embed content", () => {
		let embed;

		beforeEach(async () => {
			await adviceCommand.execute(message, client);
			embed = message.reply.mock.calls[0][0].embeds[0];
		});

		test("embed title includes the bot username", () => {
			expect(embed.data.title).toContain(client.user.username);
		});

		test("embed title includes 'Advice'", () => {
			expect(embed.data.title).toContain("Advice");
		});

		test("embed author includes devBy config", () => {
			expect(embed.data.author.name).toContain(client.config.devBy);
		});

		test("embed has an Advice field", () => {
			const field = embed.data.fields.find((f) => f.name === "Advice");
			expect(field).toBeDefined();
		});

		test("embed Advice field contains the fetched advice text", () => {
			const field = embed.data.fields.find((f) => f.name === "Advice");
			expect(field.value).toContain(mockAdviceResponse.slip.advice);
		});

		test("embed has a footer", () => {
			expect(embed.data.footer).toBeDefined();
			expect(embed.data.footer.text).toBeTruthy();
		});

		test("embed has a description", () => {
			expect(embed.data.description).toBeTruthy();
		});
	});

	describe("API failure handling", () => {
		test("replies with an error message when fetch returns no data", async () => {
			mockFetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(null) });
			await adviceCommand.execute(message, client);
			const callArgs = message.reply.mock.calls[0][0];
			expect(callArgs.content).toBeTruthy();
			expect(callArgs.embeds).toBeUndefined();
		});

		test("replies with an error message when slip is missing", async () => {
			mockFetch.mockResolvedValue({ json: jest.fn().mockResolvedValue({}) });
			await adviceCommand.execute(message, client);
			const callArgs = message.reply.mock.calls[0][0];
			expect(callArgs.content).toBeTruthy();
			expect(callArgs.embeds).toBeUndefined();
		});

		test("replies with an error message when advice text is missing", async () => {
			mockFetch.mockResolvedValue({ json: jest.fn().mockResolvedValue({ slip: {} }) });
			await adviceCommand.execute(message, client);
			const callArgs = message.reply.mock.calls[0][0];
			expect(callArgs.content).toBeTruthy();
			expect(callArgs.embeds).toBeUndefined();
		});

		test("error reply is ephemeral", async () => {
			mockFetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(null) });
			await adviceCommand.execute(message, client);
			const callArgs = message.reply.mock.calls[0][0];
			expect(callArgs.flags).toBeDefined();
		});

		test("error reply tells the user to try again later", async () => {
			mockFetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(null) });
			await adviceCommand.execute(message, client);
			expect(message.reply.mock.calls[0][0].content).toContain("try again later");
		});
	});
});
