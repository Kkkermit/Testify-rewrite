const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { SlashCategory } = require("@utils");

module.exports = {
	usableInDms: true,
	category: SlashCategory.COMMUNITY,
	data: new SlashCommandBuilder().setName(`advice`).setDescription(`Get a random piece of advice.`),
	async execute(interaction, client) {
		const data = await fetch("https://api.adviceslip.com/advice").then((res) => res.json());

		if (!data || !data.slip || !data.slip.advice) {
			return interaction.reply({
				content: "Sorry, I couldn't fetch advice at the moment. Please try again later.",
				flags: MessageFlags.Ephemeral,
			});
		}

		const embed = new EmbedBuilder()
			.setTimestamp()
			.setThumbnail(client.user.avatarURL())
			.setAuthor({ name: `Advice Command ${client.config.devBy}` })
			.setTitle(`${client.user.username} Advice Randomizer ${client.config.arrowEmoji}`)
			.setDescription(`> Here is your random advice:`)
			.addFields({ name: `Advice`, value: `> ${data.slip.advice}` })
			.setColor(client.config.embedCommunity)
			.setFooter({ text: `Advice given free of charge` });

		await interaction.reply({ embeds: [embed] });
	},
};
