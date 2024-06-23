import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export default async (
  interaction: ButtonInteraction,
  sentTo: string,
  serviceId: string
) => {
  try {
    const modal = new ModalBuilder()
      .setCustomId(`authifyModal-verifyPhone-${serviceId}-${sentTo}`)
      .setTitle("Enter OTP sent to you.");

    const otpInput = new TextInputBuilder()
      .setCustomId("otp")
      .setPlaceholder("Enter OTP")
      .setMinLength(6)
      .setMaxLength(6)
      .setRequired(true)
      .setLabel("OTP")
      .setStyle(TextInputStyle.Short);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      otpInput
    );
    modal.addComponents(row);
    await interaction.showModal(modal);
  } catch (error) {
    console.error("Error handling verify OTP interaction:", error);
  }
};
