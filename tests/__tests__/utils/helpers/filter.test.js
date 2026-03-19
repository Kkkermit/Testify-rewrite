const {
	filter,
	filterWords,
	filterSet,
	isFiltered,
	containsFilteredWord,
} = require("../../../../src/utils/helpers/filter.util");

describe("filter.util", () => {
	describe("filterWords", () => {
		test("is an array", () => {
			expect(Array.isArray(filterWords)).toBe(true);
		});

		test("is not empty", () => {
			expect(filterWords.length).toBeGreaterThan(0);
		});

		test("contains only strings", () => {
			filterWords.forEach((word) => {
				expect(typeof word).toBe("string");
			});
		});

		test("contains no empty strings", () => {
			filterWords.forEach((word) => {
				expect(word.trim().length).toBeGreaterThan(0);
			});
		});

		test("contains known profanity entries", () => {
			expect(filterWords).toContain("fuck");
			expect(filterWords).toContain("shit");
			expect(filterWords).toContain("ass");
		});

		test("contains self-harm entries", () => {
			expect(filterWords).toContain("kys");
			expect(filterWords).toContain("kms");
			expect(filterWords).toContain("suicide");
		});

		test("contains leetspeak / obfuscated entries", () => {
			expect(filterWords).toContain("5h1t");
			expect(filterWords).toContain("f_u_c_k");
			expect(filterWords).toContain("sh1t");
		});
	});

	describe("filterSet", () => {
		test("is a Set", () => {
			expect(filterSet).toBeInstanceOf(Set);
		});

		test("has the same number of unique entries as the deduplicated filterWords array", () => {
			const uniqueWords = new Set(filterWords.map((w) => w.toLowerCase()));
			expect(filterSet.size).toBe(uniqueWords.size);
		});

		test("contains known entries", () => {
			expect(filterSet.has("fuck")).toBe(true);
			expect(filterSet.has("shit")).toBe(true);
		});

		test("does not contain clean words", () => {
			expect(filterSet.has("hello")).toBe(false);
			expect(filterSet.has("world")).toBe(false);
		});
	});

	describe("filter (backwards-compatible object)", () => {
		test("is an object", () => {
			expect(typeof filter).toBe("object");
		});

		test("has a words property", () => {
			expect(filter).toHaveProperty("words");
		});

		test("filter.words is the same reference as filterWords", () => {
			expect(filter.words).toBe(filterWords);
		});

		test("filter.words.includes() works for a known bad word", () => {
			expect(filter.words.includes("fuck")).toBe(true);
		});

		test("filter.words.includes() returns false for a clean word", () => {
			expect(filter.words.includes("hello")).toBe(false);
		});

		test("filter.words.includes() is case-sensitive (matches the stored casing)", () => {
			expect(filter.words.includes("fuck")).toBe(true);
			expect(filter.words.includes("FUCK")).toBe(false);
		});
	});

	describe("isFiltered", () => {
		describe("matching words", () => {
			test("returns true for an exact match", () => {
				expect(isFiltered("fuck")).toBe(true);
			});

			test("returns true for a leetspeak variant", () => {
				expect(isFiltered("5h1t")).toBe(true);
			});

			test("returns true for a self-harm word", () => {
				expect(isFiltered("kys")).toBe(true);
			});

			test("returns true for a multi-word entry", () => {
				expect(isFiltered("blow job")).toBe(true);
			});
		});

		describe("case insensitivity", () => {
			test("returns true for uppercase input", () => {
				expect(isFiltered("FUCK")).toBe(true);
			});

			test("returns true for mixed-case input", () => {
				expect(isFiltered("FuCk")).toBe(true);
			});

			test("returns true for all-caps self-harm word", () => {
				expect(isFiltered("KYS")).toBe(true);
			});
		});

		describe("clean words", () => {
			test("returns false for a normal word", () => {
				expect(isFiltered("hello")).toBe(false);
			});

			test("returns false for an empty string", () => {
				expect(isFiltered("")).toBe(false);
			});

			test("returns false for a number string", () => {
				expect(isFiltered("12345")).toBe(false);
			});

			test("returns false for a word that only partially matches", () => {
				expect(isFiltered("assassin")).toBe(false);
			});
		});

		describe("return type", () => {
			test("always returns a boolean", () => {
				expect(typeof isFiltered("fuck")).toBe("boolean");
				expect(typeof isFiltered("hello")).toBe("boolean");
			});
		});
	});

	describe("containsFilteredWord", () => {
		describe("exact full-message matches", () => {
			test("returns true when the entire message is a filtered word", () => {
				expect(containsFilteredWord("fuck")).toBe(true);
			});

			test("returns true for a multi-word filter entry as the full message", () => {
				expect(containsFilteredWord("blow job")).toBe(true);
			});
		});

		describe("token matches within a sentence", () => {
			test("returns true when a filtered word appears at the start", () => {
				expect(containsFilteredWord("fuck this")).toBe(true);
			});

			test("returns true when a filtered word appears at the end", () => {
				expect(containsFilteredWord("you ass")).toBe(true);
			});

			test("returns true when a filtered word appears in the middle", () => {
				expect(containsFilteredWord("you shit head")).toBe(true);
			});

			test("returns true for a self-harm word in a sentence", () => {
				expect(containsFilteredWord("just kys already")).toBe(true);
			});
		});

		describe("case insensitivity", () => {
			test("returns true for uppercase filtered word in a sentence", () => {
				expect(containsFilteredWord("FUCK this")).toBe(true);
			});

			test("returns true for mixed-case filtered word", () => {
				expect(containsFilteredWord("you FuCk")).toBe(true);
			});
		});

		describe("clean messages", () => {
			test("returns false for a completely clean message", () => {
				expect(containsFilteredWord("hello world")).toBe(false);
			});

			test("returns false for an empty string", () => {
				expect(containsFilteredWord("")).toBe(false);
			});

			test("returns false for a message with only spaces", () => {
				expect(containsFilteredWord("   ")).toBe(false);
			});

			test("returns false for a word that only partially matches a filtered word", () => {
				expect(containsFilteredWord("assassin")).toBe(false);
			});

			test("returns false for a normal sentence", () => {
				expect(containsFilteredWord("the quick brown fox jumps over the lazy dog")).toBe(false);
			});
		});

		describe("return type", () => {
			test("always returns a boolean", () => {
				expect(typeof containsFilteredWord("fuck")).toBe("boolean");
				expect(typeof containsFilteredWord("hello")).toBe("boolean");
			});
		});
	});
});
