import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    PermissionsBitField,
    SlashCommandBuilder,
} from "discord.js";
import { getServicesOfDiscordGuild } from "../../../services/service.service";

export default {
    data: new SlashCommandBuilder()
        .setName("create-mobile-and-email-button")
        .setDescription("creates an otp button with Email and Phone options"),

    async execute(interaction: ChatInputCommandInteraction) {
        const permissions = interaction.member
            ?.permissions as PermissionsBitField;
        if (!permissions.has(PermissionFlagsBits.Administrator)) {
            interaction.reply({
                content: "You need to be an admin to use this command",
                ephemeral: true,
            });
            return;
        }

        const services = await getServicesOfDiscordGuild(
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

        const phoneButton = new ButtonBuilder()
            .setCustomId(`authifyButton-phone-${service?._id}`)
            .setLabel("Authenticate with Phone")
            .setStyle(ButtonStyle.Secondary);

        const emailButton = new ButtonBuilder()
            .setCustomId(`authifyButton-email-${service?._id}`)
            .setLabel("Authenticate with Email")
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            phoneButton,
            emailButton,
        );

        interaction.reply({
            content: "Success",
            ephemeral: true,
        });

        interaction?.channel?.send({
            content: "** **",
            components: [row],
        });
    },
};
