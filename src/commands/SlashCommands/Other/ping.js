const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { SlashCategory } = require("@utils");

module.exports = {
	usableInDms: true,
	category: SlashCategory.MISC,
	data: new SlashCommandBuilder().setName("ping").setDescription(`Replies with pong`),
	async execute(interaction) {
		await interaction.reply({ content: "Sent message in channel", flags: MessageFlags.Ephemeral });
		await interaction.channel.send({ content: "Pong!" });
	},
};
