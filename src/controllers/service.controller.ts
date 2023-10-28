import { Request, Response } from "express";
import { TypedRequestQuery } from "zod-express-middleware";
import { generateBotInviteLink, getGuilds } from "../utils/oauth.utils";
import { getServicesOfDiscorsGuilds } from "../services/service.service";
import { isAdmin, verifyGuild } from "../utils/discord.utils";
import { generateOrVerifyBotInviteLinkValidator } from "../inputValidators/service.validators";

export const getServicesController = async (req: Request, res: Response) => {
	try {
		const guilds = await getGuilds(req.customer.accessToken);
		const guildIds = guilds.map((guild) => guild.id);
		const services = await getServicesOfDiscorsGuilds(guildIds);
		const servicesWithGuilds = services.map((service) => {
			const guild = guilds.find((guild) => guild.id === service.guildId);
			return {
				...service.toObject(),
				guild: guild,
			};
		});
		res.send({
			data: servicesWithGuilds,
			message: "Services fetched successfully",
			success: true,
		});
	} catch (error: any) {}
};

export const getGuildsOfUserController = async (
	req: Request,
	res: Response,
) => {
	try {
		const guilds = await getGuilds(req.customer.accessToken);
		const respponseData = guilds.map((guild) => {
			return {
				id: guild.id,
				name: guild.name,
				icon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`,
				isAdmin: guild.permissions && isAdmin(guild.permissions),
			};
		});
		res.send({
			data: respponseData,
			message: "Guilds fetched successfully",
			success: true,
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
	}
};

export const generateBotInviteLinkController = async (
	req: TypedRequestQuery<typeof generateOrVerifyBotInviteLinkValidator.query>,
	res: Response,
) => {
	try {
		const url = generateBotInviteLink(req.query.guildId);
		res.send({
			data: url,
			message: "Bot invite link generated successfully",
			success: true,
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
	}
};

export const verifyBotInGuildController = async (
	req: TypedRequestQuery<typeof generateOrVerifyBotInviteLinkValidator.query>,
	res: Response,
) => {
	try {
		const isAdded = await verifyGuild(req.query.guildId);
		res.send({
			data: { isAdded },
			message: "Bot status sent.",
			success: true,
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
	}
};
