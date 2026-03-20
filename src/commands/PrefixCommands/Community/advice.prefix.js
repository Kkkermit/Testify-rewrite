const { EmbedBuilder, MessageFlags } = require("discord.js");
const { PrefixCategory } = require("@utils");

module.exports = {
	name: "advice",
	description: "Get a random piece of advice.",
	category: PrefixCategory.COMMUNITY,
	usableInDms: true,
	async execute(message, client) {
		const data = await fetch("https://api.adviceslip.com/advice").then((res) => res.json());

		if (!data || !data.slip || !data.slip.advice) {
			return message.reply({
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

		await message.reply({ embeds: [embed] });
	},
};
