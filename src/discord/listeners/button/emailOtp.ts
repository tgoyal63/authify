import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export default async (interaction: ButtonInteraction, serviceId: string) => {
  try {
    const modal = new ModalBuilder()
      .setCustomId(`authifyModal-email-${serviceId}`)
      .setTitle("Enter Email");

    const emailInput = new TextInputBuilder()
      .setCustomId("email")
      .setLabel("Enter the email with which you registered")
      .setRequired(true)
      .setPlaceholder("attacker@gangstaphilosophy.com")
      .setStyle(TextInputStyle.Short);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      emailInput
    );
    modal.addComponents(row);
    await interaction.showModal(modal);
  } catch (error) {
    console.error("Error handling email OTP interaction:", error);
  }
};
