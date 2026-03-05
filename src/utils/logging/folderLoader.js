const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function folderLoader(client) {
    const { color, getTimestamp } = require('@utils');
    const line = `${color.green}[${getTimestamp()}]${color.reset}`;
    const thin = `${color.pink}${'─'.repeat(80)}${color.reset}`;

    if (mongoose.connect) {
        console.log(`${line} ${color.green}✓${color.reset} MongoDB connected successfully`);
    }

    console.log(`\n${thin}`);
    console.log(`${line}  ${color.torquise}📦 Loading project files...${color.reset}`);

    const schemaFolder = path.join(__dirname, '../../schemas');
    fs.readdir(schemaFolder, (err, files) => {
        if (err) {
            client.logs.error('[ERROR] Error reading schemas folder:', err);
            return;
        }
        console.log(`${line}  ${color.torquise}🗃  Schemas     :${color.reset} ${files.length} loaded`);
    });

    const scriptsFolder = path.join(__dirname, '../../scripts');
    fs.readdir(scriptsFolder, (err, files) => {
        if (err) {
            client.logs.error('[ERROR] Error reading scripts folder:', err);
            return;
        }
        console.log(`${line}  ${color.torquise}📜 Scripts     :${color.reset} ${files.length} loaded`);
    });

    setTimeout(() => {
        console.log(`${line}  ${color.torquise}⚡ Events      :${color.reset} ${client.eventNames().length} loaded`);
        console.log(`${thin}\n`);
    }, 0);
}

module.exports = folderLoader;