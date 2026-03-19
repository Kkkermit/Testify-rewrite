/**
 * Command category constants.
 * Usage: const { SlashCategory, PrefixCategory } = require('@utils');
 *        category: SlashCategory.INFO
 */

const SlashCategory = Object.freeze({
	ADMIN: "AdminCommands",
	AI: "AiCommands",
	AUTOMOD: "Automod",
	COMMUNITY: "Community",
	DEVS: "Devs",
	ECONOMY: "Economy",
	FUN: "Fun",
	GIVEAWAY: "Giveaway",
	HELP: "Help",
	INFO: "InfoCommands",
	LEVEL_AND_ECONOMY: "LevelAndEconomy",
	LEVEL_SYSTEM: "LevelSystem",
	MINI_GAMES: "MiniGames",
	MISC: "Misc",
	OWNER: "Owner",
	PREFIX_SETTINGS: "PrefixSettings",
});

const PrefixCategory = Object.freeze({
	DEV: "Dev",
	ECONOMY: "EconomyCommands",
	FUN: "FunCommands",
	INFO: "InfoCommands",
	LEVEL: "LevelCommands",
	MODERATION: "ModerationCommands",
	MUSIC: "Music",
	OWNER: "OwnerCommands",
	TEST: "TestCommands",
	UTILITY: "UtilityCommands",
	COMMUNITY: "Community",
	OTHER: "Other",
});

module.exports = { SlashCategory, PrefixCategory };
