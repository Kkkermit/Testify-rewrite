module.exports = {
	// Bot Version //
	botVersion: "v3.0.1",
	githubRelease: "https://api.github.com/repos/Kkkermit/DiscordBotV14-template/releases/latest",

	// Bot Information //
	defaultPrefix: "?",
	status: "dnd",
	eventListeners: 100,
	dev: "Kkermit",
	devBy: "| Developed by kkermit",
	noPerms: (missingPerms) => {
		const formattedPerms = missingPerms
			.map((perm) => `\`${perm.toString().split("_").join(" ").toLowerCase()}\``)
			.join(", ");
		return `You **do not** have the required permissions to use this command!\nMissing Permissions: ${formattedPerms}`;
	},

	// Embed Colors //
	embedColor: "Blurple",
	embedModHard: "Red",

	// Logging Channels //
	slashCommandLoggingChannel: "1129094438669520956",
	prefixCommandLoggingChannel: "1129094438669520956",

	// Emojis //
	arrowEmoji: "⤵",
};
