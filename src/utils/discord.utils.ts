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
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    importCommand(filePath);
  }
}

/**
 * Imports a command file and adds it to the commands collection
 * @param filePath The path to the command file
 */
async function importCommand(filePath: string): Promise<void> {
  try {
    const { default: command } = await import(filePath);
    if ("data" in command && "execute" in command) {
      commands.set(command.data.name, command.data.toJSON());
    } else {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  } catch (error) {
    console.error(`Error importing ${filePath}:`, error);
  }
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

/**
 * Deploys commands to a specific guild
 * @param guildId The ID of the guild to deploy commands to
 */
export const deployCommandsToGuild = async (guildId: string): Promise<void> => {
  if (!guildId) {
    throw new Error("Guild ID is required to deploy commands.");
  }

  console.log(
    `\nStarted refreshing ${commands.size} application (/) commands.`
  );
  try {
    const data = (await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, guildId),
      { body: commands }
    )) as any;

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.\n`
    );
  } catch (error) {
    console.error("Error deploying commands to guild:", error);
    throw new Error("Failed to deploy commands to guild");
  }
};

/**
 * Checks if the provided permissions include administrator permissions
 * @param permissions The permissions to check
 * @returns True if the permissions include administrator permissions, otherwise false
 */
export const isAdmin = (permissions: string): boolean => {
  if (!permissions) {
    throw new Error("Permissions are required to check for admin status.");
  }

  const discordPermissions = new PermissionsBitField(BigInt(permissions));
  return discordPermissions.has(PermissionsBitField.Flags.Administrator);
};

/**
 * Verifies if the bot has administrator permissions in a specific guild
 * @param guildId The ID of the guild to verify
 * @returns True if the bot has administrator permissions, otherwise false
 */
export const verifyGuild = async (guildId: string): Promise<boolean> => {
  if (!guildId) {
    throw new Error("Guild ID is required to verify guild.");
  }

  try {
    const guild = await client.guilds.fetch(guildId);
    return (
      guild.members.me?.permissions.has(
        PermissionsBitField.Flags.Administrator
      ) ?? false
    );
  } catch (error) {
    console.error("Error verifying guild:", error);
    throw new Error("Failed to verify guild");
  }
};
