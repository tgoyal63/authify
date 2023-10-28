import serviceModel from "../models/mongoDB/service.model";

export const createService = async (name: string, price: number) => {
	const service = await serviceModel.create({ name, price });
	return service;
};

export const getServicesOfDiscorsGuilds = async (guildIds: string[]) => {
	const services = await serviceModel
		.find({ guildId: { $in: guildIds } })
		.populate("subscription");
	return services;
};
