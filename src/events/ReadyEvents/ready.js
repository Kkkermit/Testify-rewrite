const { Events } = require('discord.js');
const config = require('@config');
const mongoose = require('mongoose');
const { folderLoader } = require('@utils');
const { asciiText } = require('@lib');
const mongodbURL = process.env.mongodb;

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {

        if (!mongodbURL) {
            client.logs.warn('[DATABASE] No MongoDB URL has been provided. Skipping database connection.');
        } else {
            try {
                mongoose.set("strictQuery", false);
                await mongoose.connect(mongodbURL, {
                    serverSelectionTimeoutMS: 10000,
                });
            } catch (err) {
                client.logs.error(`[DATABASE] Error connecting to the database: ${err}`);
                return;
            }
        }

        folderLoader(client);
        asciiText(client);
        require('events').EventEmitter.setMaxListeners = config.eventListeners;
    },
};
