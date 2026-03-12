const { EmbedBuilder } = require("discord.js");
const { PrefixCategory } = require("@utils");

module.exports = {
	name: "uptime",
	aliases: ["botuptime"],
	category: PrefixCategory.INFO,
	usableInDms: true,
	async execute(message, client, args) {
		let totalSeconds = client.uptime / 1000;
		const days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		const hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = Math.floor(totalSeconds % 60);

		const uptime = `**${days}**d **${hours}**h **${minutes}**m **${seconds}**s`;

		const uptimeEmbed = new EmbedBuilder()
			.setAuthor({ name: `${client.user.username} uptime ${client.config.devBy}` })
			.setColor(client.config.embedColor)
			.setTitle("⏳ **Current uptime**")
			.addFields({ name: "Uptime", value: `> ${uptime}` })
			.setThumbnail(client.user.avatarURL())
			.setFooter({ text: `Uptime command` })
			.setTimestamp();

		message.channel.send({ embeds: [uptimeEmbed] });
	},
};
