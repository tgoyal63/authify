import fs from "fs";
import path from "path";
import { Collection, PermissionsBitField } from "discord.js";
import { REST, Routes } from "discord.js";
import { CLIENT_ID, TOKEN } from "../config";
import client from "../discord";

const commands = new Collection<string, any>();
const currentFileUrl = import.meta.url;
const currentDir = path.dirname(new URL(currentFileUrl).pathname);
const foldersPath = path.resolve(currentDir, "../discord/commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath: string = path.join(foldersPath, folder);
	const commandFiles: string[] = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".ts") || file.endsWith("js"));
	for (const file of commandFiles) {
		const filePath: string = path.join(commandsPath, file);
		const { default: command } = await import(filePath);
		if ("data" in command && "execute" in command) {
			commands.set(command.data.name, command.data.toJSON());
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

export const deployCommandsToGuild = async (guildId: string) => {
	console.log(
		`\nStarted refreshing ${commands.size} application (/) commands.`,
	);
	const data = (await rest.put(
		Routes.applicationGuildCommands(CLIENT_ID, guildId),
		{
			body: commands,
		},
	)) as any;

	console.log(
		`Successfully reloaded ${data.length} application (/) commands.\n`,
	);
};

export const isAdmin = (permissions: number) => {
	const discordPermissions = new PermissionsBitField(BigInt(permissions));
	return discordPermissions.has(PermissionsBitField.Flags.Administrator);
};

export const verifyGuild = async (guildId: string) => {
	const guild = await client.guilds.fetch(guildId);
	return guild.members.me?.permissions.has(
		PermissionsBitField.Flags.Administrator,
	);
};
