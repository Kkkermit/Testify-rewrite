const { getImages } = require("../../../../src/utils/helpers/images");

describe("getImages", () => {
	describe("return type", () => {
		test("returns an object", () => {
			expect(typeof getImages()).toBe("object");
		});

		test("returns a new object on each call", () => {
			expect(getImages()).not.toBe(getImages());
		});
	});

	describe("return shape", () => {
		test("contains the slashCommandEnterImage key", () => {
			expect(getImages()).toHaveProperty("slashCommandEnterImage");
		});

		test("has exactly one key", () => {
			expect(Object.keys(getImages())).toHaveLength(1);
		});
	});

	describe("values", () => {
		test("slashCommandEnterImage is a string", () => {
			expect(typeof getImages().slashCommandEnterImage).toBe("string");
		});

		test("slashCommandEnterImage is a valid URL", () => {
			expect(getImages().slashCommandEnterImage).toMatch(/^https?:\/\/.+/);
		});

		test("slashCommandEnterImage is non-empty", () => {
			expect(getImages().slashCommandEnterImage.length).toBeGreaterThan(0);
		});

		test("slashCommandEnterImage points to the expected URL", () => {
			expect(getImages().slashCommandEnterImage).toBe("https://i.postimg.cc/8CbGp6D5/Screenshot-300.png");
		});
	});

	describe("destructuring", () => {
		test("can be destructured correctly", () => {
			const { slashCommandEnterImage } = getImages();
			expect(slashCommandEnterImage).toBe("https://i.postimg.cc/8CbGp6D5/Screenshot-300.png");
		});
	});
});
