import { Client, Events, GatewayIntentBits } from "discord.js";
import { TOKEN } from "../config";
import buttonListener from "./listeners/button";
import commandListener from "./listeners/command.listener";
import modalListener from "./listeners/modal";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once("ready", (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    await buttonListener(interaction);
    await modalListener(interaction);
    await commandListener(interaction);
  } catch (error) {
    console.error("Error handling interaction:", error);
  }
});

client.on(Events.Error, (error) => {
  console.error("Client error:", error);
  client
    .login(TOKEN)
    .then(() => {
      console.log("Reconnected");
    })
    .catch((loginError) => {
      console.error("Error during reconnection:", loginError);
    });
});

// Global error handling
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
process.on("uncaughtExceptionMonitor", (error) => {
  console.error("Uncaught Exception Monitor:", error);
});

export default client;

export const loginToBot = () => {
  client.login(TOKEN).catch((error) => {
    console.error("Error logging in:", error);
  });
};
