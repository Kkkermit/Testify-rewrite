const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { getBotStats, PrefixCategory } = require("@utils");

module.exports = {
	name: "bot-info",
	aliases: ["bi", "botinfo"],
    category: PrefixCategory.INFO,
    usableInDms: true,
	async execute(message, client) {
		const refresh = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId("refresh").setLabel("Refresh").setStyle(ButtonStyle.Primary),
		);

		const stats = await getBotStats(client);

		const botInfoEmbed = new EmbedBuilder()
			.setColor(client.config.embedColor)
			.setTitle(`__${stats.username} Bot Information__`)
			.setAuthor({
				name: `Bot Information ${client.config.devBy}`,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setFooter({ text: `Most up-to-date information about ${stats.username}` })
			.setTimestamp()
			.addFields({ name: "Developer", value: `> \`${stats.developer}\`` })
			.addFields({ name: "Version", value: `> \`${stats.version}\`` })
			.addFields({ name: "Servers", value: `> \`${stats.serverCount}\`` })
			.addFields({ name: "Members", value: `> \`${stats.memberCount}\`` })
			.addFields({ name: "Prefix", value: `> \`${stats.prefix}\`` })
			.addFields({ name: "Commands", value: `> \`${stats.prefixCommandCount}\`` })
			.addFields({ name: "Aliases", value: `> \`${stats.aliasCount}\`` })
			.addFields({ name: "Slash Commands", value: `> \`${stats.slashCommandCount}\`` })
			.addFields({ name: "Latency", value: `> \`${stats.ping}ms\`` })
			.addFields({ name: "Uptime", value: `> ${stats.uptime}` });

		const sentMessage = await message.reply({ embeds: [botInfoEmbed], components: [refresh] });

		const collector = sentMessage.createMessageComponentCollector();
		collector.on("collect", async (interaction) => {
			if (interaction.customId === "refresh") {
				try {
					const refreshedStats = await getBotStats(client);

					const refreshedEmbed = new EmbedBuilder()
						.setColor(client.config.embedColor)
						.setTitle(`__${refreshedStats.username} Bot Information__`)
						.setAuthor({
							name: `Bot Information ${client.config.devBy}`,
							iconURL: client.user.displayAvatarURL({ dynamic: true }),
						})
						.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
						.setFooter({ text: `Most up-to-date information about ${refreshedStats.username}` })
						.setTimestamp()
						.addFields({ name: "Developer", value: `> \`${refreshedStats.developer}\`` })
						.addFields({ name: "Version", value: `> \`${refreshedStats.version}\`` })
						.addFields({ name: "Servers", value: `> \`${refreshedStats.serverCount}\`` })
						.addFields({ name: "Members", value: `> \`${refreshedStats.memberCount}\`` })
						.addFields({ name: "Prefix", value: `> \`${refreshedStats.prefix}\`` })
						.addFields({ name: "Commands", value: `> \`${refreshedStats.prefixCommandCount}\`` })
						.addFields({ name: "Aliases", value: `> \`${refreshedStats.aliasCount}\`` })
						.addFields({ name: "Slash Commands", value: `> \`${refreshedStats.slashCommandCount}\`` })
						.addFields({ name: "Latency", value: `> \`${refreshedStats.ping}ms\`` })
						.addFields({ name: "Uptime", value: `> ${refreshedStats.uptime}` });

					await interaction.update({ embeds: [refreshedEmbed], components: [refresh] });
				} catch (error) {
					client.logs.error(`[BOT_INFO] Error generating refresh.`, error);
				}
			}
		});
	},
};
