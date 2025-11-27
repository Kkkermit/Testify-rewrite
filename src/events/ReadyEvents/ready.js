const { Events } = require('discord.js');
const config = require('../../config');
const mongoose = require('mongoose');
const utils = require('../../utils');
const asciiText = require('../../lib/asciiText/asciiText.js')

const { folderLoader } = utils;
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
                    keepAlive: true,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
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
