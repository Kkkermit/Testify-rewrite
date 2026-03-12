const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { SlashCategory } = require('@utils')

module.exports = {
    usableInDms: true,
    category: SlashCategory.COMMUNITY,
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test command'),
    async execute(interaction, client) {

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`Test command successful | ${client.user.username} is online!`)

        await interaction.reply({ content: `<@${interaction.user.id}>` , embeds: [embed]})
    }
}