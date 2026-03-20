const { SlashCategory } = require("@utils");
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
	usableInDms: false,
	category: SlashCategory.MODERATION,
	permissions: [PermissionFlagsBits.KickMembers],
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDescription("Kicks specified user from server.")
		.addUserOption((option) =>
			option.setName("user").setDescription("Specify the user you want to kick.").setRequired(true),
		)
		.addStringOption((option) =>
			option.setName("reason").setDescription("Reason as to why you want to kick specified user.").setRequired(false),
		),
	async execute(interaction, client) {
		const users = interaction.options.getUser("user");
		const kickedMember = interaction.options.getMember("user");
		const reason = interaction.options.getString("reason") || `\`\`Reason for kick not given\`\``;

		const ID = users.id;

		if (interaction.member.id === ID)
			return interaction.reply({
				content: `You **cannot** use the \`\`kick\`\` command on yourself...`,
				flags: MessageFlags.Ephemeral,
			});
		if (client.user.id === ID)
			return interaction.reply({
				content: `You **cannot** use the \`\`kick\`\` command on me...`,
				flags: MessageFlags.Ephemeral,
			});

		if (!kickedMember)
			return interaction.reply({
				content: `The user (${ID}) **does not** exist within your server.`,
				flags: MessageFlags.Ephemeral,
			});

		const dmEmbed = new EmbedBuilder()
			.setColor(client.config.embedModHard)
			.setAuthor({ name: `${client.user.username} Kick Command` })
			.setTitle(`> You were kicked from "${interaction.guild.name}"  ${client.config.arrowEmoji}`)
			.addFields({ name: "Server", value: `> ${interaction.guild.name}`, inline: true })
			.addFields({ name: "Reason", value: `> ${reason}`, inline: true })
			.setFooter({ text: `Kicked from ${interaction.guild.name} ${client.config.devBy}` })
			.setTimestamp()
			.setThumbnail(client.user.avatarURL());

		const embed = new EmbedBuilder()
			.setColor(client.config.embedModHard)
			.setAuthor({ name: `${client.user.username} Kick Command ${client.config.devBy}` })
			.setTitle(`> User was kicked from "${interaction.guild.name}"  ${client.config.arrowEmoji}`)
			.addFields({ name: "User", value: `> ${users.tag}`, inline: true })
			.addFields({ name: "Reason", value: `> ${reason}`, inline: true })
			.setThumbnail(users.avatarURL())
			.setFooter({ text: `Someone got kicked hard` })
			.setTimestamp();

		await kickedMember.send({ embeds: [dmEmbed] }).catch((err) => {
			return client.logs.error(
				"[KICK] Failed to DM user. This can happen when their DM's are off, or the user is a bot.",
			);
		});

		await kickedMember.kick().catch((err) => {
			return interaction.reply({
				content: `**Couldn't** kick this member! Check my **role position** and try again.`,
				flags: MessageFlags.Ephemeral,
			});
		});

		await interaction.reply({ embeds: [embed] });
	},
};
