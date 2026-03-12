const { MessageFlags } = require("discord.js");
const config = require("@config");

function checkOwnerOnly(command, interaction) {
	if (!command.ownerOnly) return true;

	if (interaction.user.id !== process.env.devid) {
		interaction.reply({
			content: `\`${command.data.name}\` is restricted to the **bot owner** only.`,
			flags: MessageFlags.Ephemeral,
		});
		return false;
	}

	return true;
}

function checkMessageOwnerOnly(command, message) {
	if (!command.ownerOnly) return true;

	if (message.author.id !== process.env.devid) {
		message.reply(`\`${command.name}\` is restricted to the **bot owner** only.`);
		return false;
	}

	return true;
}

function checkDevOnly(command, interaction) {
	if (!command.devOnly) return true;

	if (!config.developerIds.includes(interaction.user.id)) {
		interaction.reply({
			content: `\`${command.data.name}\` is restricted to **bot developers** only.`,
			flags: MessageFlags.Ephemeral,
		});
		return false;
	}

	return true;
}

function checkMessageDevOnly(command, message) {
	if (!command.devOnly) return true;

	if (!config.developerIds.includes(message.author.id)) {
		message.reply(`\`${command.name}\` is restricted to **bot developers** only.`);
		return false;
	}

	return true;
}

module.exports = {
	checkOwnerOnly,
	checkMessageOwnerOnly,
	checkDevOnly,
	checkMessageDevOnly,
};
