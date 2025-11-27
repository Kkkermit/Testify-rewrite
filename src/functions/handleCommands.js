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
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
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

        console.log(`${color.blue}[${getTimestamp()}] ${color.reset}[SLASH_COMMANDS] Found ${client.commands.size} SlashCommands.`);

        const rest = new REST({
            version: '10'
        }).setToken(process.env.token);

        (async () => {
            try {
                console.log(`${color.blue}[${getTimestamp()}] ${color.reset}[SLASH_COMMANDS] Started refreshing application (/) commands.`);

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                ).catch((error) => {
                    console.error(`${color.red}[${getTimestamp()}] [SLASH_COMMANDS] Error while refreshing application (/) commands. \n${color.red}[${getTimestamp()}] [SLASH_COMMANDS] Check if your clientID is correct and matches your bots token:`, error);
                });

                console.log(`${color.blue}[${getTimestamp()}] ${color.reset}[SLASH_COMMANDS] Successfully reloaded application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        })();
    };
};