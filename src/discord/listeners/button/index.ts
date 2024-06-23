import { Interaction } from "discord.js";
import phoneOtp from "./phoneOtp";
import emailOtp from "./emailOtp";
import verifyOtp from "./verifyOtp";

export default async (interaction: Interaction) => {
  try {
    if (!interaction.isButton()) return;
    const [interactionType, name, ...args] = interaction.customId.split("-");
    if (interactionType !== "authifyButton") return;

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
    console.error("Error handling button interaction:", error);
  }
};
