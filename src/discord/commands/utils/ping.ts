import { ChatInputCommandInteraction } from "discord.js";

export default {
	data: {
		name: "ping",
		description: "Ping!",
	},
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply("Pong!");
	},
};
