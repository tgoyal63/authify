import fs from "fs";
import path from "path";
import { Collection } from "discord.js";

const commands = new Collection<string, any>();

const currentFileUrl = import.meta.url;
const currentDir = path.dirname(new URL(currentFileUrl).pathname);
const foldersPath = path.resolve(currentDir, "../discord/commands");
const commandFolders = fs.readdirSync(foldersPath);

/**
 * @param filePath The path to the command file
 * @description Imports a command file and adds it to the commands collection
 */
async function importCommand(filePath: string) {
  try {
    const { default: command } = await import(filePath);
    if ("data" in command && "execute" in command) {
      commands.set(command.data.name, command);
    } else {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  } catch (error) {
    console.error(`Error importing ${filePath}: ${error}`);
  }
}

(async () => {
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      await importCommand(filePath);
    }
  }
})();

export default commands;
