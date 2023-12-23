import { Interaction } from "discord.js";
import phoneOtp from "./phoneOtp";
import verifyOtp from "./verifyOtp";

export default async (interaction: Interaction) => {
    if (!interaction.isModalSubmit()) return;
    const [interactionType, name, ...args] = interaction.customId.split("-");
    if (interactionType !== "authifyModal") return;
    if (name === "phone") {
        if (!args[0]) return;
        phoneOtp(interaction, args[0]);
    } else if (name === "verifyPhone") {
        if (!args[0] || !args[1]) return;
        verifyOtp(interaction, args[0], args[1]);
    }
};
