const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { prefixSystem } = require('@schemas');
const { SlashCategory } = require('@utils');

module.exports = {
    usableInDms: false,
    category: SlashCategory.ADMIN,
    permissions: [PermissionFlagsBits.Administrator],
    data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('Change the prefix of the bot in your server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command => command.setName('change').setDescription('Change the prefix of the bot in your server.') .addStringOption(option => option.setName('prefix').setDescription('The new prefix you want to set.').setRequired(true)))
    .addSubcommand(command => command.setName('check').setDescription('Check the current prefix of the bot in your server.'))
    .addSubcommand(command => command.setName('reset').setDescription('Reset the prefix of the bot in your server back to the default.'))
    .addSubcommand(command => command.setName('enable').setDescription('Enable the prefix system in your server.').addBooleanOption(option => option.setName('enable').setDescription('Enable the prefix system in your server.').setRequired(true)).addStringOption(option => option.setName("prefix").setDescription("The prefix you want to set for the bot in your server. Leave blank to set to default prefix").setRequired(false)))
    .addSubcommand(command => command.setName('disable').setDescription('Disable the prefix system in your server.')),
    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand();

        let guildData;
        try {
            guildData = await prefixSystem.findOne({ Guild: interaction.guild.id });
        } catch (err) {
            return interaction.reply({ content: `Whoops, something went wrong! Please try again.`, flags: MessageFlags.Ephemeral });
        }

        if (sub !== 'enable' && sub !== 'disable' && sub !== 'check' && (!guildData || !guildData.Enabled)) {
            return interaction.reply({ content: "You **cannot** use this command as the prefix system has not yet been enabled. To enable the prefix system run **`prefix enable`**", flags: MessageFlags.Ephemeral });
        }

        switch(sub) {
            case 'change':
            try {
                const prefix = interaction.options.getString('prefix');
                if (prefix.length > 4) return interaction.reply({ content: 'The prefix **cannot** be longer than 4 characters!', flags: MessageFlags.Ephemeral });

                await prefixSystem.findOneAndUpdate(
                    { Guild: interaction.guild.id },
                    { Prefix: prefix },
                    { upsert: true, returnDocument: 'after' }
                );

                const embed = new EmbedBuilder()
                .setColor(client.config.embedModHard)
                .setAuthor({ name: `Prefix update command ${client.config.devBy}`})
                .setTitle(`${client.user.username} prefix update ${client.config.arrowEmoji}`)
                .setDescription(`The prefix has been changed to **\`${prefix}\`**`)
                .setTimestamp()
                .setFooter({ text: `Prefix updated by ${interaction.user.username}`});

                await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            } catch (err) {
                await interaction.reply({ content: `Whoops, something went wrong! Please try again.`, flags: MessageFlags.Ephemeral });
            }
            break;

            case 'check':
            try {
                const currentPrefix = guildData?.Enabled ? guildData.Prefix : client.config.defaultPrefix;

                const embed1 = new EmbedBuilder()
                .setColor(client.config.embedModHard)
                .setAuthor({ name: `Prefix check command ${client.config.devBy}`})
                .setTitle(`${client.user.username} prefix check ${client.config.arrowEmoji}`)
                .setDescription(`The prefix for this server is **\`${currentPrefix}\`**`)
                .setTimestamp()
                .setFooter({ text: `Prefix checked by ${interaction.user.username}`});

                await interaction.reply({ embeds: [embed1] });
            } catch (err) {
                await interaction.reply({ content: `Whoops, something went wrong! Please try again.`, flags: MessageFlags.Ephemeral });
            }
            break;

            case 'reset':
            try {
                if (!guildData) return interaction.reply({ content: `The prefix is already set to the **default!** ( \`${client.config.defaultPrefix}\` )`, flags: MessageFlags.Ephemeral });

                await prefixSystem.findOneAndUpdate(
                    { Guild: interaction.guild.id },
                    { Prefix: client.config.defaultPrefix }
                );

                const embed2 = new EmbedBuilder()
                .setColor(client.config.embedModHard)
                .setAuthor({ name: `Prefix reset command ${client.config.devBy}`})
                .setTitle(`${client.user.username} prefix reset ${client.config.arrowEmoji}`)
                .setDescription(`The prefix has been reset to **\`${client.config.defaultPrefix}\`**`)
                .setTimestamp()
                .setFooter({ text: `Prefix reset by ${interaction.user.username}`});

                await interaction.reply({ embeds: [embed2], flags: MessageFlags.Ephemeral });
            } catch (err) {
                await interaction.reply({ content: `Whoops, something went wrong! Please try again.`, flags: MessageFlags.Ephemeral });
            }
            break;

            case 'enable':
            try {
                const enable = interaction.options.getBoolean('enable');
                let customPrefix = interaction.options.getString('prefix');

                if (!enable) {
                    return await interaction.reply({ content: "The prefix system won't be enabled and data has not been saved. To enable the prefix system, please choose the option **`True`** when trying again. If you just wanted to change the prefix, please use the command **`prefix change <prefix>`**", flags: MessageFlags.Ephemeral });
                }

                if (!customPrefix) customPrefix = client.config.defaultPrefix;

                if (customPrefix.length > 4) {
                    return interaction.reply({ content: 'The prefix **cannot** be longer than 4 characters!', flags: MessageFlags.Ephemeral });
                }

                if (guildData?.Enabled) {
                    return await interaction.reply({ content: 'The prefix system is already **enabled** in this guild.', flags: MessageFlags.Ephemeral });
                }

                await prefixSystem.findOneAndUpdate(
                    { Guild: interaction.guild.id },
                    { Prefix: customPrefix, Enabled: true },
                    { upsert: true, returnDocument: 'after' }
                );

                const embed3 = new EmbedBuilder()
                .setColor(client.config.embedModHard)
                .setAuthor({ name: `Prefix setup command ${client.config.devBy}`})
                .setTitle(`${client.user.username} prefix setup ${client.config.arrowEmoji}`)
                .setDescription(`The prefix system has been **enabled**!`)
                .addFields({ name: 'Prefix', value: `The prefix has been set to **\`${customPrefix}\`**`})
                .addFields({ name: 'Change Custom Prefix', value: `*To change the custom prefix, run \`/prefix change <prefix>\`*`})
                .addFields({ name: 'Disable Prefix', value: "*To disable the prefix system, run `/prefix disable`*"})
                .setTimestamp()
                .setFooter({ text: `Prefix system setup by ${interaction.user.username}`});

                await interaction.reply({ embeds: [embed3] });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: `Whoops, something went wrong! Please try again.`, flags: MessageFlags.Ephemeral });
            }
            break;

            case 'disable':
            try {
                if (!guildData?.Enabled) {
                    return await interaction.reply({ content: 'The prefix system is already **disabled** in this guild.', flags: MessageFlags.Ephemeral });
                }

                await prefixSystem.findOneAndUpdate(
                    { Guild: interaction.guild.id },
                    { Enabled: false, Prefix: client.config.defaultPrefix }
                );

                await interaction.reply({ content: 'The prefix system has been **disabled**.', flags: MessageFlags.Ephemeral });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: `Whoops, something went wrong! Please try again.`, flags: MessageFlags.Ephemeral });
            }
            break;
        };
    },
};