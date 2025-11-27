const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {

        if (client.config.status) {
            setStatus();
        } else {
            client.logs.error(`[STATUS] No status provided. Please provide a valid status in the config.js file.`);
        };

        function setStatus() {
            client.user.setStatus(client.config.status);
        };
    },
};