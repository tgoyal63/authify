import { TypedRequestQuery } from "zod-express-middleware";
import client from "../discord";
import { Response } from "express";
import { guildIdValidator } from "../inputValidators/service.validators";

export const getAvailableRolesController = async (
	req: TypedRequestQuery<typeof guildIdValidator.query>,
	res: Response,
) => {
	const guildId = req.query["guildId"] as string;
	const guild = await client.guilds.fetch(guildId);
	if (!guild.members.me?.roles.highest)
		throw new Error("Bot is not in the guild");
	const botHighestRole = guild.members.me.roles.highest;
	const roles = guild.roles.cache.map((role) => {
		return {
			id: role.id,
			name: role.name,
			color: role.hexColor,
			icon: role.iconURL(),
			enabled:
				role.comparePositionTo(botHighestRole) < 0 &&
				!role.managed &&
				role.name !== "@everyone",
		};
	});
	res.send({
		success: true,
		data: roles,
		message: "Roles fetched successfully",
	});
};
