import { Request, Response } from "express";
// import { TypedRequestBody, TypedRequestQuery } from "zod-express-middleware";
import { getGuilds } from "../utils/oauth.utils";
import { getServicesOfDiscorsGuilds } from "../services/service.service";

export const getServicesController = async (req: Request, res: Response) => {
	try {
		const guilds = await getGuilds(req.customer.accessToken);
		const guildIds = guilds.map((guild) => guild.id);
		console.log(guilds);
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
