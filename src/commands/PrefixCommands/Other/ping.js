const { EmbedBuilder } = require("discord.js");
const { PrefixCategory } = require("@utils");

module.exports = {
	name: "ping",
	category: PrefixCategory.OTHER,
	usableInDms: true,
	async execute(message, client) {
		const embed = new EmbedBuilder()
			.setAuthor({ name: `${client.user.username} ${client.config.devBy}` })
			.setTitle(`${client.user.username} **ping** command ${client.config.devBy}`)
			.setDescription(`> Pong! ${client.ws.ping}ms`)
			.setColor(client.config.embedColor)
			.setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.avatarURL() })
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	},
};
