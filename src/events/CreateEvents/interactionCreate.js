const { EmbedBuilder, Events, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { color, getTimestamp, checkDmUsability, checkUnderDevelopment } = require("@utils");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;
		
		if (!checkDmUsability(command, interaction)) return;
        if (!checkUnderDevelopment(command, interaction)) return;

		if (command.permissions && command.permissions.length) {
            const missingPerms = command.permissions.filter(perm => {
                if (!interaction.member.permissions.has(perm)) {
                    return true;
                }
                return false;
            }).map(perm => {
                return Object.keys(PermissionFlagsBits).find(p => 
                    PermissionFlagsBits[p] === perm
                ).replace(/_/g, ' ').toLowerCase();
            });

            if (missingPerms.length > 0) {
                return interaction.reply({ 
                    content: client.config.noPerms(missingPerms),
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

		try {
			await command.execute(interaction, client);
		} catch (error) {
			console.error(
				`${color.red}[${getTimestamp()}] [INTERACTION_CREATE] Error while executing command. \n${
					color.red
				}[${getTimestamp()}] [INTERACTION_CREATE] Please check you are using the correct execute method: "async execute(interaction, client)": \n${
					color.red
				}[${getTimestamp()}] [INTERACTION_CREATE]`,
				error,
			);

			const embed = new EmbedBuilder()
				.setColor("Red")
				.setDescription(`There was an error while executing this command!\n\`\`\`${error}\`\`\``);

			await interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
