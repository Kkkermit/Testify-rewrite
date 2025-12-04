// ██████╗ ███████╗██╗   ██╗    ██████╗ ██╗   ██╗    ██╗  ██╗██╗  ██╗███████╗██████╗ ███╗   ███╗██╗████████╗
// ██╔══██╗██╔════╝██║   ██║    ██╔══██╗╚██╗ ██╔╝    ██║ ██╔╝██║ ██╔╝██╔════╝██╔══██╗████╗ ████║██║╚══██╔══╝
// ██║  ██║█████╗  ██║   ██║    ██████╔╝ ╚████╔╝     █████╔╝ █████╔╝ █████╗  ██████╔╝██╔████╔██║██║   ██║   
// ██║  ██║██╔══╝  ╚██╗ ██╔╝    ██╔══██╗  ╚██╔╝      ██╔═██╗ ██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╔╝██║██║   ██║   
// ██████╔╝███████╗ ╚████╔╝     ██████╔╝   ██║       ██║  ██╗██║  ██╗███████╗██║  ██║██║ ╚═╝ ██║██║   ██║   
// ╚═════╝ ╚══════╝  ╚═══╝      ╚═════╝    ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   

// Developed by: Kkermit. All rights reserved. (2025)
// MIT License

// ==================== Dependencies ====================
require('module-alias/register');
require('dotenv').config();

const { Client, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('@config');
const { color, getTimestamp, intents, partials } = require('@utils');
const { checkVersion } = require('@lib');

// ==================== Constants ====================
const PATHS = {
    FUNCTIONS: path.join(__dirname, 'functions'),
    EVENTS: path.join(__dirname, 'events'),
    COMMANDS: path.join(__dirname, 'commands'),
    PREFIX: path.join(__dirname, 'prefix'),
    PROCESS_HANDLERS: path.join(__dirname, 'functions', 'processHandlers'),
    BOOT_MODE: path.join(__dirname, 'scripts', 'bootMode.js')
};

// ==================== Client Initialization ====================
/**
 * Creates and configures the Discord client
 * @returns {Client} The configured Discord client
 */
function createClient() {
    const botStartTime = Date.now();
    
    try {
        const client = new Client({
            intents: [
                ...intents
            ],
            partials: [
                ...partials
            ]
        });
        
        // Attach utilities and config
        client.logs = require('@utils');
        client.config = config;
        client.botStartTime = botStartTime;
        
        // Initialize collections
        client.commands = new Collection();
        client.pcommands = new Collection();
        client.aliases = new Collection();
        
        return client;
    } catch (error) {
        console.error(
            `${color.red}[${getTimestamp()}]${color.reset} [ERROR] Failed to create Discord client.`,
            `\n${color.red}[${getTimestamp()}]${color.reset} [ERROR]`,
            error
        );
        process.exit(1);
    }
}

/**
 * Validates the bot token
 * @param {string} token - The Discord bot token
 * @returns {boolean} Whether the token is valid
 */
function validateToken(token) {
    if (!token) {
        console.log(
            `${color.red}[${getTimestamp()}]${color.reset} [TOKEN] No token provided.`,
            `Please provide a valid token in the .env file.`,
            `${config.botName} cannot launch without a token.`
        );
        return false;
    }
    return true;
}

/**
 * Loads all function handlers
 * @param {Client} client - The Discord client
 */
function loadFunctionHandlers(client) {
    const functions = fs
        .readdirSync(PATHS.FUNCTIONS)
        .filter(file => file.endsWith('.js'));
    
    for (const file of functions) {
        require(`${PATHS.FUNCTIONS}/${file}`)(client);
    }
}

/**
 * Loads all handlers (events, commands, prefix commands)
 * @param {Client} client - The Discord client
 */
function loadHandlers(client) {
    const eventFiles = fs.readdirSync(PATHS.EVENTS);
    const commandFolders = fs.readdirSync(PATHS.COMMANDS);
    const pcommandFolders = fs.readdirSync(PATHS.PREFIX);
    
    client.handleEvents(eventFiles, PATHS.EVENTS);
    client.handleCommands(commandFolders, PATHS.COMMANDS);
    client.prefixCommands(pcommandFolders, PATHS.PREFIX);
}

/**
 * Logs the bot into Discord
 * @param {Client} client - The Discord client
 * @param {string} token - The Discord bot token
 */
async function loginClient(client, token) {
    try {
        await client.login(token);
    } catch (error) {
        console.error(
            `${color.red}[${getTimestamp()}]${color.reset} [LOGIN] Failed to login to ${config.botName}.`,
            `\nCheck if your token is correct and that you're using the correct intents.`,
            `\n${color.red}[${getTimestamp()}]${color.reset} [LOGIN]`,
            error
        );
        process.exit(1);
    }
}

// ==================== Main Initialization ====================
/**
 * Main initialization function
 */
async function initialize() {
    const token = process.env.token;
    if (!validateToken(token)) {
        process.exit(1);
    }

    const client = createClient();
    
    await checkVersion(config.botVersion);

    require(PATHS.PROCESS_HANDLERS)();
    require(PATHS.BOOT_MODE)();
    
    loadFunctionHandlers(client);
    loadHandlers(client);

    await loginClient(client, token);
}

// Start the bot
initialize().catch(error => {
    console.error(
        `${color.red}[${getTimestamp()}]${color.reset} [FATAL] Unhandled error during initialization:`,
        error
    );
    process.exit(1);
});
