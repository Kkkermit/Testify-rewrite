// ██████╗ ███████╗██╗   ██╗    ██████╗ ██╗   ██╗    ██╗  ██╗██╗  ██╗███████╗██████╗ ███╗   ███╗██╗████████╗
// ██╔══██╗██╔════╝██║   ██║    ██╔══██╗╚██╗ ██╔╝    ██║ ██╔╝██║ ██╔╝██╔════╝██╔══██╗████╗ ████║██║╚══██╔══╝
// ██║  ██║█████╗  ██║   ██║    ██████╔╝ ╚████╔╝     █████╔╝ █████╔╝ █████╗  ██████╔╝██╔████╔██║██║   ██║
// ██║  ██║██╔══╝  ╚██╗ ██╔╝    ██╔══██╗  ╚██╔╝      ██╔═██╗ ██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╔╝██║██║   ██║
// ██████╔╝███████╗ ╚████╔╝     ██████╔╝   ██║       ██║  ██╗██║  ██╗███████╗██║  ██║██║ ╚═╝ ██║██║   ██║
// ╚═════╝ ╚══════╝  ╚═══╝      ╚═════╝    ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝

// Developed by: Kkermit. All rights reserved. (2026)
// MIT License

// Enable module aliases
require("module-alias/register");

global.startTime = Date.now();

const { Client, Collection } = require(`discord.js`);
const fs = require("fs");

const config = require("@config");
const { color, getTimestamp, gatewayIntentBits, partials } = require("@utils");
const { checkVersion } = require("@lib");

// Current Repo Version //

const currentVersion = `${config.botVersion}`;

let client;
try {
	client = new Client({
		intents: [...gatewayIntentBits],
		partials: [...partials],
	});
} catch (error) {
	console.error(
		`${color.red}[${getTimestamp()}]${color.reset} [ERROR] Error while creating the client. \n${
			color.red
		}[${getTimestamp()}]${color.reset} [ERROR]`,
		error,
	);
}

client.logs = require("@utils");
client.config = require("@config");

require("./functions/processHandlers")();

client.commands = new Collection();
client.pcommands = new Collection();
client.aliases = new Collection();

require("dotenv").config();

const functions = fs.readdirSync("./src/functions").filter((file) => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events");
const commandFolders = fs.readdirSync("./src/commands/SlashCommands");
const pcommandFolders = fs.readdirSync("./src/commands/PrefixCommands");

const token = process.env.token;
if (!token) {
	console.log(
		`${color.red}[${getTimestamp()}]${
			color.reset
		} [TOKEN] No token provided. Please provide a valid token in the .env file. ${
			config.botName
		} cannot launch without a token.`,
	);
	return;
}

(async () => {
	await checkVersion(currentVersion);

	// Load boot mode after version check
	require("./scripts/bootMode.js")();

	for (const file of functions) {
		require(`./functions/${file}`)(client);
	}
	client.handleEvents(eventFiles, "./src/events");
	client.handleCommands(commandFolders, "./src/commands");
	client.prefixCommands(pcommandFolders, "./src/commands");
	client.login(token).catch((error) => {
		console.error(
			`${color.red}[${getTimestamp()}]${color.reset} [LOGIN] Error while logging into ${
				config.botName
			}. Check if your token is correct or double check your also using the correct intents. \n${
				color.red
			}[${getTimestamp()}]${color.reset} [LOGIN]`,
			error,
		);
	});
})();
