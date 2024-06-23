import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalSubmitInteraction,
} from "discord.js";
import {
  getColumnDataofService,
  getServiceData,
} from "@/services/service.service";
import { generateOtpForDiscordId, sendOtp } from "@/utils/otp.utils";
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
    const phone = interaction.fields.getTextInputValue("phone");

    if (service?.integrationType === "tagMango") {
      const userId = await gangstaPhilosophy.subscriberValidator(
        serviceId,
        phone,
        interaction.user.id
      );
      if (userId) {
        await interaction.editReply({
          content: "Trying to send OTP ...",
        });

        const otp = generateOtpForDiscordId(interaction.user.id, userId);
        await sendOtp(parseInt(phone), otp);

        const verifyButton = new ButtonBuilder()
          .setCustomId(`authifyButton-verifyPhone-${phone}-${serviceId}`)
          .setLabel("Verify OTP")
          .setStyle(ButtonStyle.Success);

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          verifyButton
        );

        await interaction.editReply({
          content: "An OTP has been sent to your phone number.",
          components: [actionRow],
        });
        return;
      }

      await interaction.editReply({
        content:
          "We couldn't verify your phone number. Please try again or reach out to the support channel.",
      });
    } else {
      const { phoneNumbers, discordIds } = await getColumnDataofService(
        serviceId
      );

      //   const existing = discordIds.find((id, i) => {
      //     if (phoneNumbers[i] === phone) {
      //         return false;
      //     }
      //     return id === interaction.user.id;
      // });
      const existing = discordIds.find(
        (id, i) => phoneNumbers[i] === phone && id === interaction.user.id
      );
      if (existing) {
        await interaction.editReply({
          content: "You have already registered.",
        });
        return;
      }

      if (!phoneNumbers.includes(phone)) {
        await interaction.editReply({
          content:
            "Phone number not found in course. Please contact the course admin.",
        });
        return;
      }

      const existingDiscordId = discordIds[phoneNumbers.indexOf(phone)];
      if (existingDiscordId && existingDiscordId !== interaction.user.id) {
        await interaction.editReply({
          content: `Phone number already registered with <@${existingDiscordId}>.`,
        });
        return;
      }

      const otp = generateOtpForDiscordId(interaction.user.id);
      await sendOtp(parseInt(phone), otp);

      const verifyButton = new ButtonBuilder()
        .setCustomId(`authifyButton-verifyPhone-${phone}-${serviceId}`)
        .setLabel("Verify OTP")
        .setStyle(ButtonStyle.Success);

      const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        verifyButton
      );

      await interaction.editReply({
        content: "An OTP has been sent to your phone number.",
        components: [actionRow],
      });
    }
  } catch (error: any) {
    console.error("Error handling phone OTP interaction:", error);
    await interaction.editReply({
      content:
        error.message === "Fast2SMS API error."
          ? "An error occurred while sending OTP. Please try again."
          : "An error occurred. Please try again.",
    });
  }
};
