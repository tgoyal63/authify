import { PermissionsBitField } from "discord.js";

export const isAdmin = (permissions: number) => {
	const discordPermissions = new PermissionsBitField(BigInt(permissions));
	return discordPermissions.has(PermissionsBitField.Flags.Administrator);
};
