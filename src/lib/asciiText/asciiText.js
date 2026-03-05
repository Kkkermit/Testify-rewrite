function asciiText(client) {
    const { color, getTimestamp } = require('@utils');

    const line = `${color.pink}[${getTimestamp()}]${color.reset}`;
    const sep  = `${color.pink}${'═'.repeat(115)}${color.reset}`;
    const thin = `${color.pink}${'─'.repeat(115)}${color.reset}`;

    console.log(`\n${sep}`);
    console.log(`${color.pink}[${getTimestamp()}] ██████╗ ███████╗██╗   ██╗    ██████╗ ██╗   ██╗    ██╗  ██╗██╗  ██╗███████╗██████╗ ███╗   ███╗██╗████████╗${color.reset}`);
    console.log(`${color.pink}[${getTimestamp()}] ██╔══██╗██╔════╝██║   ██║    ██╔══██╗╚██╗ ██╔╝    ██║ ██╔╝██║ ██╔╝██╔════╝██╔══██╗████╗ ████║██║╚══██╔══╝${color.reset}`);
    console.log(`${color.pink}[${getTimestamp()}] ██║  ██║█████╗  ██║   ██║    ██████╔╝ ╚████╔╝     █████╔╝ █████╔╝ █████╗  ██████╔╝██╔████╔██║██║   ██║   ${color.reset}`);
    console.log(`${color.pink}[${getTimestamp()}] ██║  ██║██╔══╝  ╚██╗ ██╔╝    ██╔══██╗  ╚██╔╝      ██╔═██╗ ██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╔╝██║██║   ██║   ${color.reset}`);
    console.log(`${color.pink}[${getTimestamp()}] ██████╔╝███████╗ ╚████╔╝     ██████╔╝   ██║       ██║  ██╗██║  ██╗███████╗██║  ██║██║ ╚═╝ ██║██║   ██║   ${color.reset}`);
    console.log(`${color.pink}[${getTimestamp()}] ╚═════╝ ╚══════╝  ╚═══╝      ╚═════╝    ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   ${color.reset}`);
    console.log(`${sep}\n`);

    console.log(`${line} ${color.green}✓ ${color.reset}${color.green}Bot is online and ready!${color.reset}`);
    console.log(`${thin}`);
    console.log(`${line}  ${color.torquise}🤖 Bot Name   :${color.reset} ${client.user.username}`);
    console.log(`${line}  ${color.torquise}🌍 Servers    :${color.reset} ${client.guilds.cache.size}`);
    console.log(`${line}  ${color.torquise}👥 Members    :${color.reset} ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`);
    console.log(`${thin}\n`);
}

module.exports = asciiText;