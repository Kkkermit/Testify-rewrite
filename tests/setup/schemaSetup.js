const { createMockModel } = require("../mocks/mongooseMocks");

const mockSchemas = {
	prefixSystem: createMockModel(),
	blacklistSystem: createMockModel(),
};

jest.mock("@schemas", () => mockSchemas);

global.mockSchemas = mockSchemas;
