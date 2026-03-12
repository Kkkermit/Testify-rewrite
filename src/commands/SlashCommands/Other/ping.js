const { SlashCommandBuilder } = require('discord.js')
const { SlashCategory } = require('@utils')

module.exports = {
    usableInDms: true,
    category: SlashCategory.MISC,
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Replies with pong`),
    async execute(interaction) {
        await interaction.reply({ content: "Sent message in channel", ephemeral: true})
        await interaction.channel.send({ content: 'Pong!'})
    }
}