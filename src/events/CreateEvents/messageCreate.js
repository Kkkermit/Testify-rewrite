const { EmbedBuilder, Events, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { color, getTimestamp, checkMessageDmUsability, checkMessageUnderDevelopment, getGuildPrefix } = require("@utils");
const { prefixSystem } = require("@schemas");

module.exports = {
	name: Events.MessageCreate,
	async execute(message, client) {
		if (message.author.bot || !message.guild || message.system || message.webhookId) return;

		const prefix = await getGuildPrefix(message.guild.id);

		const guildPrefixSettings = await prefixSystem.findOne({ Guild: message.guild.id });
		if (!guildPrefixSettings || !guildPrefixSettings.Enabled) {
			if (message.content.startsWith(prefix)) {
				const reply = await message.reply({ content: 'The prefix system is yet to be set-up for this guild.', flags: MessageFlags.Ephemeral });
				setTimeout(async () => {
					await reply.delete().catch(() => {});
				}, 2500);
			}
			return;
		}

		if (!message.content.toLowerCase().startsWith(prefix)) {
			return;
		}
		const args = message.content.slice(prefix.length).trim().split(/ +/);

		const cmd = args.shift().toLowerCase();
		if (cmd.length === 0) return;

		let command = client.pcommands.get(cmd);
		if (!command) command = client.pcommands.get(client.aliases.get(cmd));

		if (!command) {
			try {
				const embed = new EmbedBuilder()
					.setColor("Red")
					.setTitle(`${client.user.username} prefix system ${client.config.arrowEmoji}`)
					.setDescription(
						`> The command you tried **does not exist**. \n> To see **all** commands, use \`\`${prefix}help\`\``,
					);

				return message.reply({ embeds: [embed], ephemeral: true });
			} catch (error) {
				client.logs.error(`[PREFIX_ERROR] Error sending 'cannot find prefix' embed.`, error);
			}
		}

		if (!checkMessageDmUsability(command, message)) return;
        if (!checkMessageUnderDevelopment(command, message)) return;

		if (!command) return;

		if (command.args && !args.length) {
			return message.reply(`You **didn't** provide any \`\`arguments\`\`.`);
		}

		if (command.permissions && command.permissions.length) {
            const missingPerms = command.permissions.filter(perm => {
                if (!message.member.permissions.has(perm)) {
                    return true;
                }
                return false;
            }).map(perm => {
                return Object.keys(PermissionFlagsBits).find(p => 
                    PermissionFlagsBits[p] === perm
                ).replace(/_/g, ' ').toLowerCase();
            });

            if (missingPerms.length > 0) {
                return message.reply({ 
                    content: client.config.noPerms(missingPerms),
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

		try {
			command.execute(message, client, args);
		} catch (error) {
			console.error(
				`${color.red}[${getTimestamp()}] [MESSAGE_CREATE] Error while executing command. \n${
					color.red
				}[${getTimestamp()}] [MESSAGE_CREATE] Please check you are using the correct execute method: "async execute(message, client, args)": \n${
					color.red
				}[${getTimestamp()}] [MESSAGE_CREATE] `,
				error,
			);

			const embed = new EmbedBuilder()
				.setColor("Red")
				.setDescription(`There was an error while executing this command!\n\`\`\`${error}\`\`\``);

			await message.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
