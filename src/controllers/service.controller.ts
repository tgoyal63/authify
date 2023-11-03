import { Request, Response } from "express";
import { TypedRequestBody, TypedRequestQuery } from "zod-express-middleware";
import { generateBotInviteLink, getGuilds } from "../utils/oauth.utils";
import {
	getServicesOfDiscorsGuilds,
	getNumberOfServicesInDiscordGuild,
} from "../services/service.service";
import { deployCommandsToGuild, isAdmin, verifyGuild } from "../utils/discord.utils";
import {
	createServiceValidator,
	guildIdValidator,
} from "../inputValidators/service.validators";

import { createService } from "../services/service.service";

export const getServicesController = async (req: Request, res: Response) => {
	try {
		const guilds = await getGuilds(req.customer.accessToken);
		const guildIds = guilds.map((guild) => guild.id);
		const services = await getServicesOfDiscorsGuilds(guildIds);
		const servicesWithGuilds = services.map((service) => {
			const guild = guilds.find((guild) => guild.id === service.guildId);
			return {
				...service,
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
	req: TypedRequestQuery<typeof guildIdValidator.query>,
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
	req: TypedRequestQuery<typeof guildIdValidator.query>,
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

export const createServiceController = async (
	req: TypedRequestBody<typeof createServiceValidator.body>,
	res: Response,
) => {
	try {
		const numberOfExistingServices =
			await getNumberOfServicesInDiscordGuild(req.body.guildId);
		if (numberOfExistingServices >= 1)
			throw new Error("You can only have one service per guild");

		const phoneNumberRow = req.body.phoneCell.match(/\d+/g)?.[0] as string;
		const phoneNumberColumn = req.body.phoneCell.match(
			/[A-Z]+/g,
		)?.[0] as string;
		const emailRow = req.body.emailCell.match(/\d+/g)?.[0];
		const emailColumn = req.body.emailCell.match(/[A-Z]+/g)?.[0] as string;
		const discordIdRow = req.body.discordIdCell.match(/\d+/g)?.[0];
		const discordIdColumn = req.body.discordIdCell.match(
			/[A-Z]+/g,
		)?.[0] as string;
		if (phoneNumberRow !== emailRow || phoneNumberRow !== discordIdRow)
			throw new Error("All the cells should be in the same row");

		const service = await createService(
			phoneNumberColumn,
			emailColumn,
			discordIdColumn,
			parseInt(phoneNumberRow),
			req.body.sheetName,
			req.body.spreadSheetUrl,
			req.body.sheetId,
			req.body.guildId,
			req.customer.id,
			req.body.roleIds,
		);

		await deployCommandsToGuild(req.body.guildId);
		
		res.send({
			data: service,
			message: "Service created successfully",
			success: true,
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
	}
};
