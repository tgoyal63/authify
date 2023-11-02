import serviceModel from "../models/mongoDB/service.model";
import spreadsheetModel from "../models/mongoDB/spreadsheet.models";
import { sheetRegex } from "../inputValidators/sheet.validators";

export const getServicesOfDiscorsGuilds = async (guildIds: string[]) => {
	const services = await serviceModel
		.find({ guildId: { $in: guildIds } })
		.populate("spreadsheet").populate("creator");
	return services;
};

export const getServicesOfDiscorsGuild = async (guildId: string) => {
	const services = await serviceModel.find({ guildId });
	return services;
}

export const createService = async (
	phoneNumberColumn: string,
	emailColumn: string,
	discordIdColumn: string,
	headerRow: number,
	sheetName: string,
	spreadsheetUrl: string,
	sheetId: number,
	guildId: string,
	creatorId: string,
) => {
	const spreadsheetId = spreadsheetUrl.match(sheetRegex)?.[1] as string;
	const service = await serviceModel.create({
		guildId,
		creator: creatorId,
	});
	const spreadsheet = await spreadsheetModel.create({
		service: service._id,
		phoneNumberColumn,
		emailColumn,
		discordIdColumn,
		headerRow,
		sheetName,
		spreadsheetUrl,
		spreadsheetId,
		sheetId,
		guildId,
	});
	service.spreadsheet = spreadsheet._id;
	await service.save();
	return service;
};
