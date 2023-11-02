import {
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ChatInputCommandInteraction,
} from "discord.js";
import { getServicesOfDiscorsGuild } from "../../../services/service.service";

export default {
	data: new SlashCommandBuilder()
		.setName("create-otp-mobile-button")
		.setDescription("creates a otp button"),

	async execute(interaction: ChatInputCommandInteraction) {
		const services = await getServicesOfDiscorsGuild(
			interaction.guildId as string,
		);
		const service = services[0];
		if (!service) {
			interaction.reply({
				content: "No services found for this guild",
				ephemeral: true,
			});
			return;
		}

		const button = new ButtonBuilder()
			.setCustomId(`otp-phone-${service?._id}-${service.spreadsheet._id}`)
			.setLabel("Authenticate with OTP")
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

		interaction.reply({
			content: "Success",
			ephemeral: true,
		});

		interaction?.channel?.send({
			content: `** **`,
			components: [row],
		});
	},
};
