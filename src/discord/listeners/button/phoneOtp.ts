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
      .setCustomId(`authifyModal-phone-${serviceId}`)
      .setTitle("Enter Mobile Number");

    const phoneInput = new TextInputBuilder()
      .setCustomId("phone")
      .setPlaceholder("Enter your mobile number")
      .setMinLength(10)
      .setMaxLength(10)
      .setRequired(true)
      .setLabel("Mobile Number")
      .setStyle(TextInputStyle.Short);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      phoneInput
    );
    modal.addComponents(row);
    await interaction.showModal(modal);
  } catch (error) {
    console.error("Error handling phone OTP interaction:", error);
  }
};
