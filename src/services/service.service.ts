import serviceModel from "../models/mongoDB/service.model";
import spreadsheetModel from "../models/mongoDB/spreadsheet.models";
import { sheetRegex } from "../inputValidators/sheet.validators";
import { getColumnData, editCell} from "../utils/sheet.utils";

export const getNumberOfServicesInDiscordGuild = async (guildId: string) => {
	const numberOfServices = await serviceModel.countDocuments({ guildId });
	return numberOfServices;
};

export const getServicesOfDiscorsGuilds = async (guildIds: string[]) => {
	const services = await serviceModel
		.find({ guildId: { $in: guildIds } })
		.populate(["spreadsheet", "creator"])
		.lean();
	return services;
};

export const getServicesOfDiscorsGuild = async (guildId: string) => {
	const services = await serviceModel.find({ guildId });
	return services;
};

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
	roles: string[],
) => {
	const spreadsheetId = spreadsheetUrl.match(sheetRegex)?.[1] as string;
	const service = await serviceModel.create({
		guildId,
		creator: creatorId,
		roles,
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

export const columnDataValuesToPhoneNumber = (
	phoneNumberDataValues: any[][],
) => {
	return (
		phoneNumberDataValues?.map((row) => {
			if (!row[0]) return null;
			const num = row[0].replace(/\D/g, "");
			if (num.length === 10) return num as string;
			else if (num.length === 12 && num.startsWith("91"))
				return num.slice(2) as string;
			else return null;
		}) || []
	);
};

export const getColumnDataofService = async (serviceId: string) => {
	const service = await serviceModel
		.findById(serviceId)
		.populate("spreadsheet");
	if (
		!service ||
		!service.spreadsheet ||
		!service.spreadsheet.spreadsheetId ||
		!service.spreadsheet.sheetName ||
		!service.spreadsheet.phoneNumberColumn
	)
		throw new Error(
			"Either Service Does Not exist or Spreadsheet is invalid",
		);
	const spreadsheet = service.spreadsheet;
	const phoneNumberColumn = spreadsheet.phoneNumberColumn;
	const discordIdColumn = spreadsheet.discordIdColumn;
	// const emailColumn = spreadsheet.emailColumn;

	const [phoneNumberData, discordIdData] = await Promise.all([
		getColumnData(
			spreadsheet.spreadsheetId,
			spreadsheet.sheetName,
			phoneNumberColumn,
		),
		getColumnData(
			spreadsheet.spreadsheetId,
			spreadsheet.sheetName,
			discordIdColumn,
		),
		// getColumnData(
		// 	spreadsheet.spreadsheetId,
		// 	spreadsheet.sheetName,
		// 	emailColumn,
		// ),
	]);

	const discordIds =
		discordIdData.values?.map((row) => row[0] as string) || [];

	if (!phoneNumberData.values) return { phoneNumbers: [], discordIds };

	const phoneNumbers = columnDataValuesToPhoneNumber(phoneNumberData.values);
	return { phoneNumbers, discordIds };
};

export const updateDiscordIdForPhoneNumberandFetchRoles = async (
	serviceId: string,
	phoneNumber: string,
	discordId: string,
) => {
	const service = await serviceModel
		.findById(serviceId)
		.populate("spreadsheet");
	if (
		!service ||
		!service.spreadsheet ||
		!service.spreadsheet.spreadsheetId ||
		!service.spreadsheet.sheetName ||
		!service.spreadsheet.phoneNumberColumn ||
		!service.spreadsheet.discordIdColumn
	)
		throw new Error(
			"Either Service Does Not exist or Spreadsheet is invalid",
		);
	const spreadsheet = service.spreadsheet;
	const phoneNumberData = await getColumnData(
		spreadsheet.spreadsheetId,
		spreadsheet.sheetName,
		spreadsheet.phoneNumberColumn,
	);
	if (!phoneNumberData.values) throw new Error("No phone data in sheet.");
	const phoneNumbers = columnDataValuesToPhoneNumber(phoneNumberData.values);
	const rowNumber = phoneNumbers.indexOf(phoneNumber);
	if (rowNumber === -1) throw new Error("Phone Number not in sheet");

	await editCell(
		spreadsheet.spreadsheetId,
		spreadsheet.sheetName,
		`${spreadsheet.discordIdColumn}${rowNumber + 1}`,
		discordId,
	);
	return service.roles;
};
