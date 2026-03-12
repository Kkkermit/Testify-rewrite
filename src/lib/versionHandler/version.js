const axios = require("axios");
const config = require("@config");
const { color, getTimestamp } = require("@utils");

async function getLatestVersion() {
	try {
		const response = await axios.get(config.githubRelease);
		const latestVersion = response.data.tag_name;
		return latestVersion;
	} catch (error) {
		return null;
	}
}

async function checkVersion(currentVersion) {
	const latestVersion = await getLatestVersion();
	const sep = `${color.pink}${"─".repeat(80)}${color.reset}`;

	console.log(`\n${sep}`);
	if (latestVersion && currentVersion < latestVersion) {
		console.log(
			`${color.yellow}[${getTimestamp()}]${color.reset} ${color.yellow}⚠ Update available!${color.reset} ${color.torquise}${latestVersion}${color.reset} is out → https://github.com/Kkkermit/DiscordBotV14-template`,
		);
	} else {
		console.log(
			`${color.torquise}[${getTimestamp()}]${color.reset} ${color.green}✓${color.reset} Version ${color.torquise}${config.botVersion}${color.reset} — you're up to date!`,
		);
	}
	console.log(`${sep}\n`);
}

module.exports = { getLatestVersion, checkVersion };
