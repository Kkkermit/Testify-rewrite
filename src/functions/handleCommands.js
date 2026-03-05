const { REST } = require("@discordjs/rest");
const { Routes } = require('discord.js');
const fs = require('fs');
const { color, getTimestamp } = require('@utils');

const clientId = process.env.clientid; 
if (!clientId) {
    console.error(`${color.red}[${getTimestamp()}] [SLASH_COMMANDS] No client ID provided. Please provide a valid client ID in the .env file.`);
    return;
}

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/SlashCommands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/SlashCommands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());

                if (command.name) {
                    client.commands.set(command.name, command);
            
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

        console.log(`${color.blue}[${getTimestamp()}]${color.reset} ${color.green}✓${color.reset} Slash commands loaded ${color.purple}(${client.commands.size} commands)${color.reset}`);

        const rest = new REST({ version: '10' }).setToken(process.env.token);

        (async () => {
            try {
                console.log(`${color.blue}[${getTimestamp()}]${color.reset} ${color.yellow}↻${color.reset} Registering slash commands with Discord...`);

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                ).catch((error) => {
                    console.error(`${color.red}[${getTimestamp()}] [SLASH_COMMANDS] Failed to register commands. Check your clientID matches your bot token:${color.reset}`, error);
                });

                console.log(`${color.blue}[${getTimestamp()}]${color.reset} ${color.green}✓${color.reset} Slash commands registered with Discord successfully`);
            } catch (error) {
                console.error(error);
            }
        })();
    };
};