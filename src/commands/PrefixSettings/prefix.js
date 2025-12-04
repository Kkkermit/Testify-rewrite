const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const prefixSchema = require('@schemas/prefixSystem');

module.exports = {
    usableInDms: false,
    category: "Prefix Settings",
    permissions: [PermissionFlagsBits.Administrator],
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('Manage the custom prefix system for your server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(command => 
            command
                .setName('change')
                .setDescription('Change the prefix of the bot in your server.')
                .addStringOption(option => 
                    option
                        .setName('prefix')
                        .setDescription('The new prefix you want to set.')
                        .setRequired(true)
                        .setMaxLength(4)
                )
        )
        .addSubcommand(command => 
            command
                .setName('check')
                .setDescription('Check the current prefix of the bot in your server.')
        )
        .addSubcommand(command => 
            command
                .setName('reset')
                .setDescription('Reset the prefix back to the default.')
        )
        .addSubcommand(command => 
            command
                .setName('enable')
                .setDescription('Enable the custom prefix system in your server.')
                .addStringOption(option => 
                    option
                        .setName('prefix')
                        .setDescription('The prefix you want to set. Leave blank for default.')
                        .setRequired(false)
                        .setMaxLength(4)
                )
        )
        .addSubcommand(command => 
            command
                .setName('disable')
                .setDescription('Disable the custom prefix system in your server.')
        ),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        // Check if prefix system is enabled for all commands except 'enable'
        if (subcommand !== 'enable') {
            const settings = await prefixSchema.findOne({ Guild: interaction.guild.id });
            
            if (!settings || !settings.Enabled) {
                return await interaction.reply({ 
                    content: 'The prefix system is not enabled in this server. Use `/prefix enable` to enable it first.', 
                    flags: MessageFlags.Ephemeral 
                });
            }
        }

        switch(subcommand) {
            case 'change':
                await handleChange(interaction, client);
                break;
            case 'check':
                await handleCheck(interaction, client);
                break;
            case 'reset':
                await handleReset(interaction, client);
                break;
            case 'enable':
                await handleEnable(interaction, client);
                break;
            case 'disable':
                await handleDisable(interaction, client);
                break;
        }
    },
};

/**
 * Handle changing the prefix
 */
async function handleChange(interaction, client) {
    try {
        const newPrefix = interaction.options.getString('prefix');

        await prefixSchema.findOneAndUpdate(
            { Guild: interaction.guild.id },
            { Prefix: newPrefix },
            { upsert: true }
        );

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({ name: `Prefix Updated ${client.config.devBy}` })
            .setTitle(`${client.user.username} Prefix System ${client.config.arrowEmoji}`)
            .setDescription(`The prefix has been changed to **\`${newPrefix}\`**`)
            .setTimestamp()
            .setFooter({ text: `Updated by ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch (error) {
        client.logs.error('[PREFIX_CHANGE] Error changing prefix:', error);
        await interaction.reply({ 
            content: 'An error occurred while changing the prefix. Please try again.', 
            flags: MessageFlags.Ephemeral 
        });
    }
}

/**
 * Handle checking the current prefix
 */
async function handleCheck(interaction, client) {
    try {
        const settings = await prefixSchema.findOne({ Guild: interaction.guild.id });

        const currentPrefix = settings?.Prefix || client.config.defaultPrefix;

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({ name: `Prefix Check ${client.config.devBy}` })
            .setTitle(`${client.user.username} Prefix System ${client.config.arrowEmoji}`)
            .setDescription(`The current prefix for this server is **\`${currentPrefix}\`**`)
            .setTimestamp()
            .setFooter({ text: `Checked by ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        client.logs.error('[PREFIX_CHECK] Error checking prefix:', error);
        await interaction.reply({ 
            content: 'An error occurred while checking the prefix. Please try again.', 
            flags: MessageFlags.Ephemeral 
        });
    }
}

/**
 * Handle resetting the prefix to default
 */
async function handleReset(interaction, client) {
    try {
        await prefixSchema.findOneAndUpdate(
            { Guild: interaction.guild.id },
            { Prefix: client.config.defaultPrefix },
            { upsert: true }
        );

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({ name: `Prefix Reset ${client.config.devBy}` })
            .setTitle(`${client.user.username} Prefix System ${client.config.arrowEmoji}`)
            .setDescription(`The prefix has been reset to **\`${client.config.defaultPrefix}\`**`)
            .setTimestamp()
            .setFooter({ text: `Reset by ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch (error) {
        client.logs.error('[PREFIX_RESET] Error resetting prefix:', error);
        await interaction.reply({ 
            content: 'An error occurred while resetting the prefix. Please try again.', 
            flags: MessageFlags.Ephemeral 
        });
    }
}

/**
 * Handle enabling the prefix system
 */
async function handleEnable(interaction, client) {
    try {
        const settings = await prefixSchema.findOne({ Guild: interaction.guild.id });

        if (settings?.Enabled) {
            return await interaction.reply({ 
                content: 'The prefix system is already enabled in this server.', 
                flags: MessageFlags.Ephemeral 
            });
        }

        const customPrefix = interaction.options.getString('prefix') || client.config.defaultPrefix;

        await prefixSchema.findOneAndUpdate(
            { Guild: interaction.guild.id },
            { 
                Prefix: customPrefix,
                Enabled: true 
            },
            { upsert: true }
        );

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({ name: `Prefix System Enabled ${client.config.devBy}` })
            .setTitle(`${client.user.username} Prefix System ${client.config.arrowEmoji}`)
            .setDescription('The prefix system has been **enabled**!')
            .addFields(
                { name: 'Current Prefix', value: `\`${customPrefix}\`` },
                { name: 'Change Prefix', value: 'Use `/prefix change <prefix>` to update it' },
                { name: 'Disable System', value: 'Use `/prefix disable` to turn it off' }
            )
            .setTimestamp()
            .setFooter({ text: `Enabled by ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        client.logs.error('[PREFIX_ENABLE] Error enabling prefix system:', error);
        await interaction.reply({ 
            content: 'An error occurred while enabling the prefix system. Please try again.', 
            flags: MessageFlags.Ephemeral 
        });
    }
}

/**
 * Handle disabling the prefix system
 */
async function handleDisable(interaction, client) {
    try {
        const settings = await prefixSchema.findOne({ Guild: interaction.guild.id });

        if (!settings?.Enabled) {
            return await interaction.reply({ 
                content: 'The prefix system is already disabled in this server.', 
                flags: MessageFlags.Ephemeral 
            });
        }

        await prefixSchema.findOneAndUpdate(
            { Guild: interaction.guild.id },
            { 
                Enabled: false,
                Prefix: client.config.defaultPrefix 
            }
        );

        await interaction.reply({ 
            content: `The prefix system has been **disabled**. The bot will now use the default prefix \`${client.config.defaultPrefix}\`.`, 
            flags: MessageFlags.Ephemeral 
        });
    } catch (error) {
        client.logs.error('[PREFIX_DISABLE] Error disabling prefix system:', error);
        await interaction.reply({ 
            content: 'An error occurred while disabling the prefix system. Please try again.', 
            flags: MessageFlags.Ephemeral 
        });
    }
}
