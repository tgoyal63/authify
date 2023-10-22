import fs from "fs";
import path from "path";
import { Collection } from "discord.js";

const commands = new Collection<string, any>();

const currentFileUrl = import.meta.url;
const currentDir = path.dirname(new URL(currentFileUrl).pathname);
const foldersPath = path.resolve(currentDir, "../discord/commands");
const commandFolders = fs.readdirSync(foldersPath);

async function importCommand(filePath: string) {
	try {
		const { default: command } = await import(filePath);
		if ("data" in command && "execute" in command) {
			commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	} catch (error) {
		console.error(`Error importing ${filePath}: ${error}`);
	}
}

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath);
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		await importCommand(filePath);
	}
}

export default commands;
