const { addBadges } = require("../../../../src/utils/helpers/discordBadges.util");

describe("addBadges", () => {
	describe("empty input", () => {
		test('returns ["X"] for an empty array', () => {
			expect(addBadges([])).toEqual(["X"]);
		});
	});

	describe("known badges", () => {
		test("maps ActiveDeveloper to the correct emoji string", () => {
			const result = addBadges(["ActiveDeveloper"]);
			expect(result[0]).toContain("<:VisualDev:1111819318951419944>");
		});

		test("maps BugHunterLevel1 correctly", () => {
			expect(addBadges(["BugHunterLevel1"])).toEqual(["<:bughunter:1189779614143365120>"]);
		});

		test("maps BugHunterLevel2 correctly", () => {
			expect(addBadges(["BugHunterLevel2"])).toEqual(["<:bughunter2:1189779791142977629>"]);
		});

		test("maps PremiumEarlySupporter correctly", () => {
			expect(addBadges(["PremiumEarlySupporter"])).toEqual(["<:early:1240379450835865691>"]);
		});

		test("maps Partner correctly", () => {
			expect(addBadges(["Partner"])).toEqual(["<:partner:1189780724115574865>"]);
		});

		test("maps HypeSquadOnlineHouse1 correctly", () => {
			expect(addBadges(["HypeSquadOnlineHouse1"])).toEqual(["<:bravery:1189779986517860382>"]);
		});

		test("maps HypeSquadOnlineHouse2 correctly", () => {
			expect(addBadges(["HypeSquadOnlineHouse2"])).toEqual(["<:brilliance:1189780421983088681>"]);
		});

		test("maps HypeSquadOnlineHouse3 correctly", () => {
			expect(addBadges(["HypeSquadOnlineHouse3"])).toEqual(["<:balance:1189780198556708924>"]);
		});

		test("maps CertifiedModerator correctly", () => {
			expect(addBadges(["CertifiedModerator"])).toEqual(["<:mod:1240380119109996615>"]);
		});

		test("maps VerifiedDeveloper correctly", () => {
			expect(addBadges(["VerifiedDeveloper"])).toEqual(["<:verifieddev:1189781284294242324>"]);
		});
	});

	describe("unknown badges", () => {
		test('returns "❔" for an unrecognised badge name', () => {
			expect(addBadges(["UnknownBadge"])).toEqual(["❔"]);
		});

		test('returns "❔" for each unrecognised badge in a mixed array', () => {
			const result = addBadges(["ActiveDeveloper", "FakeBadge"]);
			expect(result[0]).toContain("<:VisualDev:1111819318951419944>");
			expect(result[1]).toBe("❔");
		});
	});

	describe("multiple badges", () => {
		test("maps multiple known badges correctly", () => {
			const result = addBadges(["BugHunterLevel1", "Partner", "VerifiedDeveloper"]);
			expect(result).toHaveLength(3);
			expect(result[0]).toBe("<:bughunter:1189779614143365120>");
			expect(result[1]).toBe("<:partner:1189780724115574865>");
			expect(result[2]).toBe("<:verifieddev:1189781284294242324>");
		});

		test("returns an array of the same length as the input", () => {
			const input = ["BugHunterLevel1", "Partner", "Hypesquad"];
			expect(addBadges(input)).toHaveLength(input.length);
		});
	});

	describe("return type", () => {
		test("always returns an array", () => {
			expect(Array.isArray(addBadges([]))).toBe(true);
			expect(Array.isArray(addBadges(["Partner"]))).toBe(true);
		});
	});
});
