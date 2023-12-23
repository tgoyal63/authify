import { Client, Events, GatewayIntentBits } from "discord.js";
import { TOKEN } from "../config";
import buttonListener from "./listeners/button";
import commandListener from "./listeners/command.listener";
import modalListener from "./listeners/modal";

const token = TOKEN;

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once("ready", (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	buttonListener(interaction);
	modalListener(interaction);
	commandListener(interaction);
});

client.on(Events.Error, (e) => {
	client.login(token);
	console.log("Reconnecting...", e);
});

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);
process.on("uncaughtExceptionMonitor", console.error);

export default client;

export const loginToBot = () => client.login(token);
