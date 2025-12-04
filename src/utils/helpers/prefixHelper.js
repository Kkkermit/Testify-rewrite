const prefixSchema = require('@schemas/prefixSystem');

async function getMessagePrefix(message, client) {
    if (!message.guild) {
        return client.config.defaultPrefix;
    }

    try {
        const guildSettings = await prefixSchema.findOne({ 
            Guild: message.guild.id 
        });

        if (!guildSettings || !guildSettings.Enabled) {
            return client.config.defaultPrefix;
        }

        return guildSettings.Prefix;
    } catch (error) {
        client.logs.error('[PREFIX_HELPER] Error fetching prefix:', error);
        return client.config.defaultPrefix;
    }
}

module.exports = { getMessagePrefix };
