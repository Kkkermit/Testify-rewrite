const { PrefixCategory } = require("@utils");
const { EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
	name: "kick",
	aliases: ["boot"],
	description: "Kick a user from the server",
	usage: "kick <user> [reason]",
	category: PrefixCategory.MODERATION,
	usableInDms: false,
	permissions: [PermissionFlagsBits.KickMembers],
	async execute(message, client, args) {
		const user = message.guild.members.cache.get(args[1]) || message.mentions.members.first();

		if (!user)
			return message.channel.send({ content: "Please mention a **user** to kick.", flags: MessageFlags.Ephemeral });

		const kickReason = args.slice(1).join(" ") || `\`\`No reason given\`\``;

		if (user.id === client.user.id)
			return message.channel.send({
				content: "You **cannot** kick me from the server!",
				flags: MessageFlags.Ephemeral,
			});
		if (user.id === message.member.id)
			return message.channel.send({
				content: "You **cannot** kick yourself from the server!",
				flags: MessageFlags.Ephemeral,
			});

		if (!message.guild.members.cache.has(user.id))
			return message.channel.send({
				content: "That user **does not** exist within your server.",
				flags: MessageFlags.Ephemeral,
			});

		if (user.kickable) {
			const dmEmbed = new EmbedBuilder()
				.setAuthor({ name: `${client.user.username} Kick Command` })
				.setColor(client.config.embedModHard)
				.setTitle(`> You were kicked from "${message.guild.name}"  ${client.config.arrowEmoji}`)
				.addFields({ name: "Server", value: `> ${message.channel.guild}`, inline: true })
				.addFields({ name: "Reason", value: `> ${kickReason}`, inline: true })
				.setFooter({ text: `Kicked from ${message.channel.guild} ${client.config.devBy}` })
				.setTimestamp()
				.setThumbnail(client.user.avatarURL());

			user.send({ embeds: [dmEmbed] }).catch((err) => {
				return client.logs.error(
					"[KICK] Failed to DM user. This can happen when their DM's are off, or the user is a bot.",
				);
			});
			user.kick({ reason: kickReason });

			const kickEmbed = new EmbedBuilder()
				.setAuthor({ name: `${client.user.username} Kick Command` })
				.setTitle(`> Kick Command ${client.config.arrowEmoji}`)
				.setColor(client.config.embedModHard)
				.addFields({ name: "User", value: `> ${user}`, inline: true })
				.addFields({ name: "Reason", value: `> ${kickReason}`, inline: true })
				.setFooter({ text: `Someone got kicked from the server` })
				.setThumbnail(user.avatarURL())
				.setTimestamp();

			message.channel.send({ embeds: [kickEmbed] });
		} else {
			const Failed = new EmbedBuilder()
				.setDescription(`Failed to kick **${user}**!`)
				.setColor(client.config.embedModHard);
			message.channel.send({ embeds: [Failed], flags: MessageFlags.Ephemeral }).catch((err) => {
				return;
			});
		}
	},
};
