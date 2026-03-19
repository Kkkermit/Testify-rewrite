const {
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	ButtonStyle,
	ButtonBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	MessageFlags,
} = require("discord.js");
const {
	SlashCategory,
	getSlashCommandsByCategory,
	getPrefixCommandsByCategory,
	getCategoryEmoji,
	getImages,
	getGuildPrefix,
} = require("@utils");

module.exports = {
	usableInDms: true,
	category: SlashCategory.COMMUNITY,
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Cannot find what you were wishing to? Check this out!")
		.addSubcommand((command) => command.setName("server").setDescription("Join our official support server!"))
		.addSubcommand((command) =>
			command.setName("manual").setDescription("Get some information on our bot commands and plans."),
		),
	async execute(interaction, client) {
		const { slashCommandEnterImage } = getImages();

		const sub = interaction.options.getSubcommand();

		switch (sub) {
			case "server": {
				const button = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setLabel("Support Server")
						.setEmoji("🔗")
						.setStyle(ButtonStyle.Link)
						.setURL(client.config.botServerInvite),
				);

				const embedHelpServer = new EmbedBuilder()
					.setColor(client.config.embedColor)
					.setTitle(`${client.user.username} Help Center ${client.config.arrowEmoji}`)
					.setFooter({ text: `🚑 ${client.user.username}'s support server` })
					.setTimestamp()
					.setAuthor({ name: `🚑 Help Command ${client.config.devBy}` })
					.setDescription(
						`> Join our official support server for ${client.user.username}! \n> Get help, report bugs, and more!`,
					)
					.setThumbnail(client.user.avatarURL())
					.addFields({
						name: `Manual link to the Discord server:`,
						value: `> [SERVER INVITE](${client.config.botServerInvite})`,
					});

				await interaction.reply({ embeds: [embedHelpServer], components: [button] });
				break;
			}

			case "manual": {
				const slashCommandCategories = getSlashCommandsByCategory(client);
				const prefixCommandCategories = getPrefixCommandsByCategory(client);

				const categoryOptions = Object.keys(slashCommandCategories).map((category) => {
					return {
						label: `${getCategoryEmoji(category)} ${category}`,
						description: `View ${category} commands`,
						value: category,
						emoji: getCategoryEmoji(category),
					};
				});

				categoryOptions.unshift({
					label: "📚 Help Center",
					description: "Navigate to the Help Center.",
					value: "helpcenter",
					emoji: "📚",
				});

				const categorySelectMenu = new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("help_category_select")
						.setPlaceholder("📚 Select a category")
						.setMinValues(1)
						.setMaxValues(1)
						.addOptions(categoryOptions),
				);

				const switchToPrefixRow = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("switch_to_prefix_help")
						.setLabel("View Prefix Commands")
						.setStyle(ButtonStyle.Primary),
				);

				const guildPrefix = await getGuildPrefix(interaction.guild?.id);

				const categoryList = Object.keys(slashCommandCategories)
					.map((cat) => `${getCategoryEmoji(cat)} **${cat}**`)
					.join(" • ");

				const embed = new EmbedBuilder()
					.setColor(client.config.embedColor)
					.setTitle(`${client.user.username} Help Center ${client.config.arrowEmoji}`)
					.setAuthor({ name: `🚑 Help Command ${client.config.devBy}` })
					.setFooter({ text: `🚑 ${client.user.username}'s help center` })
					.setThumbnail(client.user.avatarURL())
					.addFields({
						name: `📊 Commands Statistics`,
						value: `> Get all **Commands** (**${client.commands.size}** slash & **${client.pcommands.size}** prefix) ${client.user.username} offers!`,
					})
					.addFields({
						name: `🔤 What's my prefix?`,
						value: `> The prefix for **${interaction.guild ? interaction.guild.name : client.user.username}** is \`\`${guildPrefix}\`\``,
					})
					.addFields({ name: `📂 Categories`, value: `> ${categoryList}` })
					.addFields({
						name: "🔗 Support Server",
						value: `> Join our [support server](${client.config.botServerInvite}) for help`,
					})
					.addFields({ name: "💬 Feedback", value: "> Use `/suggestion` to send feedback and suggestions" })
					.setImage(slashCommandEnterImage)
					.setTimestamp();

				interaction.client.helpData = {
					slashCommandCategories,
					prefixCommandCategories,
					guildPrefix,
				};

				await interaction.reply({
					embeds: [embed],
					components: [categorySelectMenu, switchToPrefixRow],
					flags: MessageFlags.Ephemeral,
				});
				break;
			}
		}
	},
};
