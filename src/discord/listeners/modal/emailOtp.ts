import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalSubmitInteraction,
} from "discord.js";
import { getServiceData } from "@/services/service.service";
import { sendEmail } from "@/utils/email.utils";
import { generateOtpForDiscordId } from "@/utils/otp.utils";
import gangstaPhilosophy from "@/customSolutions/gangstaPhilosophy";

export default async (
  interaction: ModalSubmitInteraction,
  serviceId: string
) => {
  try {
    await interaction.reply({
      content: "Validating User ...",
      ephemeral: true,
    });

    const service = await getServiceData(serviceId);
    const email = interaction.fields.getTextInputValue("email");

    if (service?.integrationType === "tagMango") {
      const userId = await gangstaPhilosophy.subscriberValidator(
        serviceId,
        email,
        interaction.user.id
      );
      if (userId) {
        await interaction.editReply({
          content: "Trying to send OTP ...",
        });

        const otp = generateOtpForDiscordId(interaction.user.id, userId);
        await sendEmail(
          email,
          "OTP for Attack Mode - Discord",
          `Your OTP is ${otp}`
        );

        const verifyButton = new ButtonBuilder()
          .setCustomId(`authifyButton-verifyPhone-${email}-${serviceId}`)
          .setLabel("Verify OTP")
          .setStyle(ButtonStyle.Success);

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          verifyButton
        );

        await interaction.editReply({
          content: "An OTP has been sent to your email (check spam folder too)",
          components: [actionRow],
        });
        return;
      }

      await interaction.editReply({
        content:
          "We couldn't verify your email. Please try again or reach out to the support channel.",
      });
    }
  } catch (error: any) {
    console.error("Error handling email OTP interaction:", error);
    await interaction.editReply({
      content:
        error.message === "Fast2SMS API error."
          ? "An error occurred while sending OTP. Please try again."
          : "An error occurred. Please try again.",
    });
  }
};
