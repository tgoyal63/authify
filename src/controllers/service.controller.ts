import { Request, Response } from "express";
// import { TypedRequestBody, TypedRequestQuery } from "zod-express-middleware";
import { getGuilds } from "../utils/oauth.utils";
import { getServicesOfDiscorsGuilds } from "../services/service.service";

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
		console.log(guilds);
		res.send({
			data: guilds,
			message: "Guilds fetched successfully",
			success: true,
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
	}
};
