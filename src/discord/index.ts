import { Client, GatewayIntentBits , Events} from 'discord.js';
// import buttonListener from './listeners/buttonListener';
// import modalListener from './listeners/modalListener';
import {TOKEN} from '../config';
import commandListener from '../discord/listeners/commandListener';

const token = TOKEN;

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});


client.once('ready', c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    // buttonListener(interaction);
    // modalListener(interaction);
    commandListener(interaction);

});

client.on(Events.Error, (e) => {
    client.login(token);
    console.log("Reconnecting...", e);
});

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
process.on('uncaughtExceptionMonitor', console.error);



export default client;

export const loginToBot = () => client.login(token);
