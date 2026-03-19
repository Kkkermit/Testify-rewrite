const { createMockClient } = require("../../../mocks/discordMocks");

jest.mock("fs");
jest.mock("mongoose", () => ({ connect: jest.fn() }));

const fs = require("fs");
const mongoose = require("mongoose");
const folderLoader = require("../../../../src/utils/logging/folderLoader.util");

describe("folderLoader", () => {
	let client;

	beforeEach(() => {
		jest.useFakeTimers();
		jest.spyOn(console, "log").mockImplementation(() => {});
		client = createMockClient({
			eventNames: jest.fn().mockReturnValue(["ready", "messageCreate", "interactionCreate"]),
		});
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	describe("mongoose connection log", () => {
		test("logs MongoDB connected when mongoose.connect exists", () => {
			fs.readdir.mockImplementation(() => {});
			folderLoader(client);
			const allOutput = console.log.mock.calls.flat().join(" ");
			expect(allOutput).toContain("MongoDB connected successfully");
		});

		test("logs the loading project files message", () => {
			fs.readdir.mockImplementation(() => {});
			folderLoader(client);
			const allOutput = console.log.mock.calls.flat().join(" ");
			expect(allOutput).toContain("Loading project files");
		});
	});

	describe("schemas folder — success", () => {
		beforeEach(() => {
			fs.readdir.mockImplementation((folderPath, cb) => {
				if (folderPath.includes("schemas")) cb(null, ["prefixSystem.schema.js"]);
				else cb(null, ["bootMode.js", "commitRunner.js"]);
			});
		});

		test("logs the schema count", () => {
			folderLoader(client);
			const allOutput = console.log.mock.calls.flat().join(" ");
			expect(allOutput).toContain("Schemas");
			expect(allOutput).toContain("1 loaded");
		});

		test("does not call client.logs.error for schemas", () => {
			folderLoader(client);
			expect(client.logs.error).not.toHaveBeenCalled();
		});
	});

	describe("schemas folder — error", () => {
		beforeEach(() => {
			fs.readdir.mockImplementation((folderPath, cb) => {
				if (folderPath.includes("schemas")) cb(new Error("schemas read error"), null);
				else cb(null, []);
			});
		});

		test("calls client.logs.error when schemas folder cannot be read", () => {
			folderLoader(client);
			expect(client.logs.error).toHaveBeenCalledWith(expect.stringContaining("schemas"), expect.any(Error));
		});

		test("does not log schema count on error", () => {
			folderLoader(client);
			const allOutput = console.log.mock.calls.flat().join(" ");
			expect(allOutput).not.toContain("Schemas");
		});
	});

	describe("scripts folder — success", () => {
		beforeEach(() => {
			fs.readdir.mockImplementation((folderPath, cb) => {
				if (folderPath.includes("scripts")) cb(null, ["bootMode.js", "commitRunner.js", "lintRunner.js"]);
				else cb(null, []);
			});
		});

		test("logs the scripts count", () => {
			folderLoader(client);
			const allOutput = console.log.mock.calls.flat().join(" ");
			expect(allOutput).toContain("Scripts");
			expect(allOutput).toContain("3 loaded");
		});

		test("does not call client.logs.error for scripts", () => {
			folderLoader(client);
			expect(client.logs.error).not.toHaveBeenCalled();
		});
	});

	describe("scripts folder — error", () => {
		beforeEach(() => {
			fs.readdir.mockImplementation((folderPath, cb) => {
				if (folderPath.includes("scripts")) cb(new Error("scripts read error"), null);
				else cb(null, []);
			});
		});

		test("calls client.logs.error when scripts folder cannot be read", () => {
			folderLoader(client);
			expect(client.logs.error).toHaveBeenCalledWith(expect.stringContaining("scripts"), expect.any(Error));
		});

		test("does not log scripts count on error", () => {
			folderLoader(client);
			const allOutput = console.log.mock.calls.flat().join(" ");
			expect(allOutput).not.toContain("Scripts");
		});
	});

	describe("setTimeout — events log", () => {
		beforeEach(() => {
			fs.readdir.mockImplementation((folderPath, cb) => cb(null, []));
		});

		test("logs the event count after the timer fires", () => {
			folderLoader(client);
			jest.runAllTimers();
			const allOutput = console.log.mock.calls.flat().join(" ");
			expect(allOutput).toContain("Events");
			expect(allOutput).toContain("3 loaded");
		});

		test("calls client.eventNames() inside the timer", () => {
			folderLoader(client);
			jest.runAllTimers();
			expect(client.eventNames).toHaveBeenCalled();
		});

		test("does not log the events line before the timer fires", () => {
			folderLoader(client);
			const allOutput = console.log.mock.calls.flat().join(" ");
			expect(allOutput).not.toContain("Events");
		});
	});

	describe("console output", () => {
		test("calls console.log at least once", () => {
			fs.readdir.mockImplementation((_, cb) => cb(null, []));
			folderLoader(client);
			expect(console.log).toHaveBeenCalled();
		});

		test("logs MongoDB connected message when mongoose.connect is truthy", () => {
			fs.readdir.mockImplementation((_, cb) => cb(null, []));
			folderLoader(client);
			const calls = console.log.mock.calls.map((c) => c[0]);
			expect(calls.some((msg) => msg.includes("MongoDB connected successfully"))).toBe(true);
		});

		test("logs loading project files message", () => {
			fs.readdir.mockImplementation((_, cb) => cb(null, []));
			folderLoader(client);
			const calls = console.log.mock.calls.map((c) => c[0]);
			expect(calls.some((msg) => msg.includes("Loading project files"))).toBe(true);
		});
	});

	describe("fs.readdir — schemas", () => {
		test("reads the schemas folder", () => {
			fs.readdir.mockImplementation((_, cb) => cb(null, []));
			folderLoader(client);
			const calledPaths = fs.readdir.mock.calls.map((c) => c[0]);
			expect(calledPaths.some((p) => p.includes("schemas"))).toBe(true);
		});

		test("logs schema count on success", () => {
			fs.readdir.mockImplementation((dirPath, cb) => {
				if (dirPath.includes("schemas")) cb(null, ["a.js", "b.js"]);
				else cb(null, []);
			});
			folderLoader(client);
			const calls = console.log.mock.calls.map((c) => c[0]);
			expect(calls.some((msg) => msg.includes("2 loaded") && msg.includes("Schemas"))).toBe(true);
		});

		test("calls client.logs.error when schemas readdir fails", () => {
			const err = new Error("schemas read error");
			fs.readdir.mockImplementation((dirPath, cb) => {
				if (dirPath.includes("schemas")) cb(err, null);
				else cb(null, []);
			});
			folderLoader(client);
			expect(client.logs.error).toHaveBeenCalledWith(expect.stringContaining("schemas"), err);
		});

		test("does not log schema count when readdir errors", () => {
			const err = new Error("fail");
			fs.readdir.mockImplementation((dirPath, cb) => {
				if (dirPath.includes("schemas")) cb(err, null);
				else cb(null, []);
			});
			folderLoader(client);
			const calls = console.log.mock.calls.map((c) => c[0]);
			expect(calls.some((msg) => msg.includes("Schemas") && msg.includes("loaded"))).toBe(false);
		});
	});

	describe("fs.readdir — scripts", () => {
		test("reads the scripts folder", () => {
			fs.readdir.mockImplementation((_, cb) => cb(null, []));
			folderLoader(client);
			const calledPaths = fs.readdir.mock.calls.map((c) => c[0]);
			expect(calledPaths.some((p) => p.includes("scripts"))).toBe(true);
		});

		test("logs scripts count on success", () => {
			fs.readdir.mockImplementation((dirPath, cb) => {
				if (dirPath.includes("scripts")) cb(null, ["x.js", "y.js", "z.js"]);
				else cb(null, []);
			});
			folderLoader(client);
			const calls = console.log.mock.calls.map((c) => c[0]);
			expect(calls.some((msg) => msg.includes("3 loaded") && msg.includes("Scripts"))).toBe(true);
		});

		test("calls client.logs.error when scripts readdir fails", () => {
			const err = new Error("scripts read error");
			fs.readdir.mockImplementation((dirPath, cb) => {
				if (dirPath.includes("scripts")) cb(err, null);
				else cb(null, []);
			});
			folderLoader(client);
			expect(client.logs.error).toHaveBeenCalledWith(expect.stringContaining("scripts"), err);
		});

		test("does not log scripts count when readdir errors", () => {
			const err = new Error("fail");
			fs.readdir.mockImplementation((dirPath, cb) => {
				if (dirPath.includes("scripts")) cb(err, null);
				else cb(null, []);
			});
			folderLoader(client);
			const calls = console.log.mock.calls.map((c) => c[0]);
			expect(calls.some((msg) => msg.includes("Scripts") && msg.includes("loaded"))).toBe(false);
		});
	});

	describe("setTimeout — events log", () => {
		test("logs event count after timer fires", () => {
			fs.readdir.mockImplementation((_, cb) => cb(null, []));
			folderLoader(client);
			jest.runAllTimers();
			const calls = console.log.mock.calls.map((c) => c[0]);
			expect(calls.some((msg) => msg.includes("Events") && msg.includes("3 loaded"))).toBe(true);
		});

		test("calls client.eventNames() inside the timer", () => {
			fs.readdir.mockImplementation((_, cb) => cb(null, []));
			folderLoader(client);
			jest.runAllTimers();
			expect(client.eventNames).toHaveBeenCalled();
		});

		test("does not log event count before the timer fires", () => {
			fs.readdir.mockImplementation((_, cb) => cb(null, []));
			folderLoader(client);
			const calls = console.log.mock.calls.map((c) => c[0]);
			expect(calls.some((msg) => msg.includes("Events") && msg.includes("loaded"))).toBe(false);
		});
	});

	describe("mongoose.connect check", () => {
		test("does not log MongoDB message when mongoose.connect is falsy", () => {
			mongoose.connect = null;
			fs.readdir.mockImplementation((_, cb) => cb(null, []));
			folderLoader(client);
			const calls = console.log.mock.calls.map((c) => c[0]);
			expect(calls.some((msg) => msg.includes("MongoDB connected successfully"))).toBe(false);
			mongoose.connect = jest.fn();
		});
	});
});
