import { PermissionsBitField } from "discord.js";

import client from "../discord";

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
