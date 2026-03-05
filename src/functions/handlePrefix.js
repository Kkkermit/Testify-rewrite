const fs = require("fs");
const { color, getTimestamp } = require("@utils");

module.exports = (client) => {
	client.prefixCommands = async (prefixFolders, path) => {
		for (const folder of prefixFolders) {
			const commands = fs.readdirSync(`${path}/PrefixCommands/${folder}`).filter((file) => file.endsWith(".js"));

			for (const file of commands) {
				const command = require(`../commands/PrefixCommands/${folder}/${file}`);

				if (command.name) {
					client.pcommands.set(command.name, command);

					if (command.aliases && Array.isArray(command.aliases)) {
						command.aliases.forEach((alias) => {
							client.aliases.set(alias, command.name);
						});
					}
				} else {
					continue;
				}
			}
		}

		console.log(`${color.blue}[${getTimestamp()}] ${color.reset}[PREFIX_COMMANDS] Started refreshing prefix (?) commands.`);

		console.log(
			`${color.blue}[${getTimestamp()}] ${color.reset}[PREFIX_COMMANDS] Found ${
				client.pcommands.size
			} PrefixCommands.`,
		);

		(async () => {
			try {
				console.log(`${color.blue}[${getTimestamp()}] ${color.reset}[PREFIX_COMMANDS] Successfully reloaded prefix (?) commands.`);
			} catch (error) {
				console.error(error);
			}
		})();
	};
};
