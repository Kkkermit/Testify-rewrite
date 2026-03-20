const { EmbedBuilder } = require("discord.js");
const blacklistSchema = require("@schemas");

async function checkBlacklistSlash(interaction, client) {
	const blacklistUserData = await blacklistSchema.findOne({
		userId: interaction.user.id,
	});

	if (!blacklistUserData) return true;

	const embed = new EmbedBuilder()
		.setAuthor({ name: `Blacklist System` })
		.setTitle(`You are blacklisted from using ${client.user.username}`)
		.setDescription(`Reason: ${blacklistUserData.reason}`)
		.setColor(client.config.embedColor)
		.setFooter({ text: `${client.user.username} Blacklist System` })
		.setTimestamp();

	const reply = await interaction.reply({ embeds: [embed], withResponse: true });
	setTimeout(async () => {
		await reply.delete();
	}, 5000);

	return false;
}

async function checkBlacklistPrefix(message, client) {
	const blacklistUserData = await blacklistSchema.findOne({
		userId: message.author.id,
	});

	if (!blacklistUserData) return true;

	const embed = new EmbedBuilder()
		.setAuthor({ name: `Blacklist System` })
		.setTitle(`You are blacklisted from using ${client.user.username}`)
		.setDescription(`Reason: ${blacklistUserData.reason}`)
		.setColor(client.config.embedColor)
		.setFooter({ text: `You are blacklisted from using this bot` })
		.setTimestamp();

	const reply = await message.reply({ embeds: [embed], withResponse: true });
	setTimeout(async () => {
		await reply.delete();
	}, 2500);

	return false;
}

module.exports = { checkBlacklistSlash, checkBlacklistPrefix };
