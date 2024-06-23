import { Interaction } from "discord.js";
import phoneOtp from "./phoneOtp";
import verifyOtp from "./verifyOtp";
import emailOtp from "./emailOtp";

export default async (interaction: Interaction) => {
  try {
    if (!interaction.isModalSubmit()) return;
    const [interactionType, name, ...args] = interaction.customId.split("-");
    if (interactionType !== "authifyModal") return;

    switch (name) {
      case "phone":
        if (args[0]) await phoneOtp(interaction, args[0]);
        break;
      case "email":
        if (args[0]) await emailOtp(interaction, args[0]);
        break;
      case "verifyPhone":
        if (args[0] && args[1]) await verifyOtp(interaction, args[0], args[1]);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Error handling modal interaction:", error);
  }
};
