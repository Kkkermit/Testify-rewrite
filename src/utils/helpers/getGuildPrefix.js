const { prefixSystem } = require("@schemas");
const config = require("@config");

async function getGuildPrefix(guildId) {
	if (!guildId) return config.defaultPrefix;

	try {
		const data = await prefixSystem.findOne({ Guild: guildId });
		if (data?.Enabled && data?.Prefix) return data.Prefix;
	} catch {
		// Ignore database errors and fall back to the default prefix
	}

	return config.defaultPrefix;
}

module.exports = { getGuildPrefix };
