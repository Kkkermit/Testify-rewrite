function asciiText(client, startTime) {
	const { color, getTimestamp } = require("@utils");

	const textEffects = {
		bold: "\x1b[1m",
		underline: "\x1b[4m",
		reset: "\x1b[0m",
	};

	const line = `${color.pink}[${getTimestamp()}]${color.reset}`;
	const sep = `${color.pink}${"═".repeat(130)}${color.reset}`;
	const thin = `${color.pink}${"─".repeat(115)}${color.reset}`;

	console.log(`\n${sep}`);
	console.log(
		`${color.pink}[${getTimestamp()}] ██████╗ ███████╗██╗   ██╗    ██████╗ ██╗   ██╗    ██╗  ██╗██╗  ██╗███████╗██████╗ ███╗   ███╗██╗████████╗${color.reset}`,
	);
	console.log(
		`${color.pink}[${getTimestamp()}] ██╔══██╗██╔════╝██║   ██║    ██╔══██╗╚██╗ ██╔╝    ██║ ██╔╝██║ ██╔╝██╔════╝██╔══██╗████╗ ████║██║╚══██╔══╝${color.reset}`,
	);
	console.log(
		`${color.pink}[${getTimestamp()}] ██║  ██║█████╗  ██║   ██║    ██████╔╝ ╚████╔╝     █████╔╝ █████╔╝ █████╗  ██████╔╝██╔████╔██║██║   ██║   ${color.reset}`,
	);
	console.log(
		`${color.pink}[${getTimestamp()}] ██║  ██║██╔══╝  ╚██╗ ██╔╝    ██╔══██╗  ╚██╔╝      ██╔═██╗ ██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╔╝██║██║   ██║   ${color.reset}`,
	);
	console.log(
		`${color.pink}[${getTimestamp()}] ██████╔╝███████╗ ╚████╔╝     ██████╔╝   ██║       ██║  ██╗██║  ██╗███████╗██║  ██║██║ ╚═╝ ██║██║   ██║   ${color.reset}`,
	);
	console.log(
		`${color.pink}[${getTimestamp()}] ╚═════╝ ╚══════╝  ╚═══╝      ╚═════╝    ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   ${color.reset}`,
	);
	console.log(`${sep}\n`);

	console.log(`${line} ${color.green}✓ ${color.reset}${color.green}Bot is online and ready!${color.reset}`);
	console.log(`${thin}`);
	console.log(`${line}  ${color.torquise}🤖 Bot Name   :${color.reset} ${client.user.username}`);
	console.log(`${line}  ${color.torquise}🌍 Servers    :${color.reset} ${client.guilds.cache.size}`);
	console.log(
		`${line}  ${color.torquise}👥 Members    :${color.reset} ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`,
	);

	const startupTime = startTime
		? `${textEffects.bold}${textEffects.underline} ➜  Ready in: ${Date.now() - startTime}ms${textEffects.reset}`
		: "";
	if (startupTime) console.log(`${line}  ${color.torquise}⚡ Startup    :${color.reset}${startupTime}`);

	console.log(`${thin}\n`);
}

function asciiTextCommitRunner() {
	const { color } = require("@utils");

	const sep = `${color.blue}${"═".repeat(115)}${color.reset}`;
	const thin = `${color.blue}${"─".repeat(115)}${color.reset}`;

	console.log(`\n${sep}`);
	console.log(
		`${color.blue}  ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗████████╗    ██████╗ ██╗   ██╗███╗   ██╗███╗   ██╗███████╗██████╗ ${color.reset}`,
	);
	console.log(
		`${color.blue} ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║╚══██╔══╝    ██╔══██╗██║   ██║████╗  ██║████╗  ██║██╔════╝██╔══██╗${color.reset}`,
	);
	console.log(
		`${color.blue} ██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║       ██████╔╝██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝${color.reset}`,
	);
	console.log(
		`${color.blue} ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║       ██╔══██╗██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗${color.reset}`,
	);
	console.log(
		`${color.blue} ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║       ██║  ██║╚██████╔╝██║ ╚████║██║ ╚████║███████╗██║  ██║${color.reset}`,
	);
	console.log(
		`${color.blue}  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝       ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝${color.reset}`,
	);
	console.log(`${sep}`);
	console.log(
		`${color.blue}  Interactive commit runner — follow the prompts below to create a conventional commit${color.reset}`,
	);
	console.log(`${thin}\n`);
}

module.exports = { asciiText, asciiTextCommitRunner };
