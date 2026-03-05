const config = require("@config");

function getBotStats(client) {
	let totalSeconds = (client.uptime || 0) / 1000;
	const days = Math.floor(totalSeconds / 86400);
	totalSeconds %= 86400;
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds % 60);
	const uptime = `**${days}**d **${hours}**h **${minutes}**m **${seconds}**s`;

	const serverCount = client.guilds.cache.size;
	const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

	const slashCommandCount = client.commands?.size ?? 0;
	const prefixCommandCount = client.pcommands?.size ?? 0;
	const aliasCount = client.aliases?.size ?? 0;

	return {
		username: client.user.username,
		version: config.botVersion,
		prefix: config.prefix,
		ping: Math.round(client.ws.ping),
		uptime,
		uptimeRaw: client.uptime || 0,
		serverCount,
		memberCount,
		slashCommandCount,
		prefixCommandCount,
		aliasCount,
		developer: config.dev,
	};
}

module.exports = { getBotStats };
