const { SlashCategory, PrefixCategory } = require("./commandCategorys");

function getSlashCommandsByCategory(client) {
	const categories = {};

	client.commands.forEach((command) => {
		const category = command.category || SlashCategory.MISC;

		if (category === SlashCategory.OWNER) return;

		if (!categories[category]) {
			categories[category] = [];
		}

		let subcommands = [];
		if (command.data && command.data.options) {
			subcommands = command.data.options
				.filter((opt) => opt.toJSON().type === 1)
				.map((sub) => ({
					name: sub.name,
					description: sub.description,
				}));
		}

		categories[category].push({
			name: command.data.name,
			description: command.data.description,
			usableInDms: command.usableInDms || false,
			underDevelopment: command.underDevelopment || false,
			subcommands,
		});
	});

	return categories;
}

function getPrefixCommandsByCategory(client) {
	const categories = {};

	client.pcommands.forEach((command) => {
		const category = command.category || PrefixCategory.OTHER;

		if (category === PrefixCategory.OWNER) return;

		if (!categories[category]) {
			categories[category] = [];
		}

		categories[category].push({
			name: command.name,
			description: command.description || "No description provided",
			usableInDms: command.usableInDms || false,
			aliases: command.aliases || [],
			underDevelopment: command.underDevelopment || false,
			subcommands: command.subcommands || [],
		});
	});

	return categories;
}

function createCommandPages(commands, itemsPerPage = 6, prefix = "") {
	const pages = [];
	for (let i = 0; i < commands.length; i += itemsPerPage) {
		pages.push(commands.slice(i, i + itemsPerPage));
	}
	return pages;
}

function getCategoryEmoji(category) {
	const emojiMap = {
		[SlashCategory.INFO]: "📚",
		[SlashCategory.COMMUNITY]: "👥",
		[SlashCategory.ADMIN]: "🛡️",
		[SlashCategory.FUN]: "🎮",
		[SlashCategory.ECONOMY]: "💰",
		[SlashCategory.AI]: "🤖",
		[SlashCategory.MISC]: "🔧",
		[SlashCategory.PREFIX_SETTINGS]: "🔤",
		[SlashCategory.LEVEL_SYSTEM]: "📈",
		[SlashCategory.LEVEL_AND_ECONOMY]: "💹",
		[SlashCategory.MINI_GAMES]: "🎯",
		[SlashCategory.AUTOMOD]: "⚙️",
		[SlashCategory.DEVS]: "👨‍💻",
		[SlashCategory.GIVEAWAY]: "🎁",
		[PrefixCategory.INFO]: "📚",
		[PrefixCategory.COMMUNITY]: "👥",
		[PrefixCategory.MODERATION]: "🛡️",
		[PrefixCategory.FUN]: "🎮",
		[PrefixCategory.ECONOMY]: "💰",
		[PrefixCategory.MUSIC]: "🎵",
		[PrefixCategory.UTILITY]: "🔧",
		[PrefixCategory.LEVEL]: "📈",
		[PrefixCategory.OTHER]: "❓",
	};

	return emojiMap[category] || "📌";
}

module.exports = {
	getSlashCommandsByCategory,
	getPrefixCommandsByCategory,
	createCommandPages,
	getCategoryEmoji,
};
