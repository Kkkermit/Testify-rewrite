const { getTimeBetween, getFormattedTime } = require("../../../../src/utils/helpers/timeHelper.util");

describe("timeUtils", () => {
	describe("getTimeBetween", () => {
		describe("basic time differences", () => {
			test('returns "0s" when now and future are the same', () => {
				expect(getTimeBetween(1000, 1000)).toBe("0s");
			});

			test("returns seconds only when under a minute", () => {
				expect(getTimeBetween(0, 30000)).toBe("30s");
			});

			test("returns minutes and seconds", () => {
				expect(getTimeBetween(0, 90000)).toBe("1m 30s");
			});

			test("returns hours, minutes and seconds", () => {
				expect(getTimeBetween(0, 3661000)).toBe("1h 1m 1s");
			});

			test("returns hours and minutes when seconds are 0", () => {
				expect(getTimeBetween(0, 3600000)).toBe("1h");
			});

			test("returns minutes only when no hours or seconds", () => {
				expect(getTimeBetween(0, 60000)).toBe("1m");
			});
		});

		describe("edge cases", () => {
			test('returns "0s" when future is in the past', () => {
				expect(getTimeBetween(5000, 1000)).toBe("0s");
			});

			test("handles large values correctly", () => {
				// 2 hours, 30 minutes, 15 seconds
				expect(getTimeBetween(0, 9015000)).toBe("2h 30m 15s");
			});
		});
	});

	describe("getFormattedTime", () => {
		describe("basic formatting", () => {
			test("returns seconds only for values under a minute", () => {
				expect(getFormattedTime(30000)).toBe("30 seconds");
			});

			test('returns "1 second" singular for exactly 1 second', () => {
				expect(getFormattedTime(1000)).toBe("1 second");
			});

			test("returns minutes only when no hours or seconds", () => {
				expect(getFormattedTime(60000)).toBe("1 minute");
			});

			test('returns "1 minute" singular for exactly 1 minute', () => {
				expect(getFormattedTime(60000)).toBe("1 minute");
			});

			test('returns "2 minutes" plural for more than 1 minute', () => {
				expect(getFormattedTime(120000)).toBe("2 minutes");
			});

			test("returns hours and minutes", () => {
				expect(getFormattedTime(3660000)).toBe("1 hour 1 minute");
			});

			test('returns "1 hour" singular for exactly 1 hour', () => {
				expect(getFormattedTime(3600000)).toBe("1 hour");
			});

			test('returns "2 hours" plural for more than 1 hour', () => {
				expect(getFormattedTime(7200000)).toBe("2 hours");
			});

			test("returns hours, minutes and seconds combined", () => {
				expect(getFormattedTime(3661000)).toBe("1 hour 1 minute 1 second");
			});
		});

		describe("edge cases", () => {
			test("returns empty string for 0 milliseconds", () => {
				expect(getFormattedTime(0)).toBe("");
			});

			test("handles large values correctly", () => {
				// 2 hours, 30 minutes, 15 seconds
				expect(getFormattedTime(9015000)).toBe("2 hours 30 minutes 15 seconds");
			});
		});

		describe("return type", () => {
			test("always returns a string", () => {
				expect(typeof getFormattedTime(0)).toBe("string");
				expect(typeof getFormattedTime(3600000)).toBe("string");
			});
		});
	});
});
