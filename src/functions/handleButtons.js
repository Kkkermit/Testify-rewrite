const fs = require("fs");
const path = require("path");
const { Events } = require("discord.js");

module.exports = (client) => {
	client.handleButtons = async (buttonFolders, basePath) => {
		client.buttons = new Map();

		for (const folder of buttonFolders) {
			const buttonFiles = fs
				.readdirSync(path.join(basePath, folder))
				.filter((file) => file.endsWith(".js"));

			for (const file of buttonFiles) {
				const button = require(path.join(basePath, folder, file));
				
				if (!button.customId) {
					console.warn(`[WARNING] Button at ${folder}/${file} is missing customId property.`);
					continue;
				}

				const customIds = Array.isArray(button.customId) ? button.customId : [button.customId];
				
				customIds.forEach(id => {
					client.buttons.set(id, button);
				});
			}
		}

		client.on(Events.InteractionCreate, async (interaction) => {
			if (!interaction.isButton()) return;

			const button = client.buttons.get(interaction.customId);
			
			if (!button) return;

			try {
				await button.execute(interaction, client);
			} catch (error) {
				console.error(`[ERROR] Error executing button ${interaction.customId}:`, error);
				
				const errorMessage = {
					content: 'There was an error while executing this button!',
					ephemeral: true
				};

				if (interaction.replied || interaction.deferred) {
					await interaction.followUp(errorMessage).catch(console.error);
				} else {
					await interaction.reply(errorMessage).catch(console.error);
				}
			}
		});
	};
};
