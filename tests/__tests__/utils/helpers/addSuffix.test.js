const { addSuffix } = require("../../../../src/utils/helpers/addSuffix");

describe("addSuffix", () => {
	describe("1st, 21st, 31st", () => {
		test('1 returns "1st"', () => expect(addSuffix(1)).toBe("1st"));
		test('21 returns "21st"', () => expect(addSuffix(21)).toBe("21st"));
		test('31 returns "31st"', () => expect(addSuffix(31)).toBe("31st"));
		test('101 returns "101st"', () => expect(addSuffix(101)).toBe("101st"));
	});

	describe("2nd, 22nd, 32nd", () => {
		test('2 returns "2nd"', () => expect(addSuffix(2)).toBe("2nd"));
		test('22 returns "22nd"', () => expect(addSuffix(22)).toBe("22nd"));
		test('32 returns "32nd"', () => expect(addSuffix(32)).toBe("32nd"));
		test('102 returns "102nd"', () => expect(addSuffix(102)).toBe("102nd"));
	});

	describe("3rd, 23rd, 33rd", () => {
		test('3 returns "3rd"', () => expect(addSuffix(3)).toBe("3rd"));
		test('23 returns "23rd"', () => expect(addSuffix(23)).toBe("23rd"));
		test('33 returns "33rd"', () => expect(addSuffix(33)).toBe("33rd"));
		test('103 returns "103rd"', () => expect(addSuffix(103)).toBe("103rd"));
	});

	describe("th — general cases", () => {
		test('4 returns "4th"', () => expect(addSuffix(4)).toBe("4th"));
		test('5 returns "5th"', () => expect(addSuffix(5)).toBe("5th"));
		test('10 returns "10th"', () => expect(addSuffix(10)).toBe("10th"));
		test('20 returns "20th"', () => expect(addSuffix(20)).toBe("20th"));
		test('100 returns "100th"', () => expect(addSuffix(100)).toBe("100th"));
	});

	describe("th — 11th, 12th, 13th teen exceptions", () => {
		test('11 returns "11th" not "11st"', () => expect(addSuffix(11)).toBe("11th"));
		test('12 returns "12th" not "12nd"', () => expect(addSuffix(12)).toBe("12th"));
		test('13 returns "13th" not "13rd"', () => expect(addSuffix(13)).toBe("13th"));
		test('111 returns "111th"', () => expect(addSuffix(111)).toBe("111th"));
		test('112 returns "112th"', () => expect(addSuffix(112)).toBe("112th"));
		test('113 returns "113th"', () => expect(addSuffix(113)).toBe("113th"));
	});

	describe("return type", () => {
		test("always returns a string", () => {
			expect(typeof addSuffix(1)).toBe("string");
			expect(typeof addSuffix(11)).toBe("string");
			expect(typeof addSuffix(100)).toBe("string");
		});

		test("returned string starts with the original number", () => {
			expect(addSuffix(42)).toMatch(/^42/);
			expect(addSuffix(7)).toMatch(/^7/);
		});
	});
});
