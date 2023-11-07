import { Response } from "express";
import { getInternalSheets, getCell, editCell, getColumnData } from "../utils/sheet.utils";
import { TypedRequestQuery } from "zod-express-middleware";
import {
	getInternalSheetValidator,
	sheetHeadersValidator,
	sheetHeadersValidatorV2,
	sheetRegex,
} from "../inputValidators/sheet.validators";

export const getInternalSheetController = async (
	req: TypedRequestQuery<typeof getInternalSheetValidator.query>,
	res: Response,
) => {
	try {
		const sheetSplit = req.query.spreadSheetUrl.match(sheetRegex);
		if (!sheetSplit) {
			res.send({ success: false, message: "No sheet found" });
			return;
		}
		const spreadSheetId = sheetSplit[1] as string;

		const internalSheetData = await getInternalSheets(spreadSheetId);
		if (!internalSheetData) {
			res.send({ success: false, message: "No sheet found" });
			return;
		}

		const respponseData = internalSheetData.map((sheet) => {
			return {
				sheetId: sheet.properties?.sheetId,
				title: sheet.properties?.title,
				index: sheet.properties?.index,
			};
		});
		res.send({
			success: true,
			data: respponseData,
			message: "Internal sheet data fetched succesfully.",
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
	}
};

export const validateSheetHeadersController = async (
	req: TypedRequestQuery<typeof sheetHeadersValidator.query>,
	res: Response,
) => {
	try {
		const sheetSplit = req.query.spreadSheetUrl.match(sheetRegex);
		if (!sheetSplit) throw new Error("No sheet found");
		const spreadSheetId = sheetSplit[1] as string;
		const sheetName = req.query.sheetName;
		const phoneNumberCell = req.query.phoneCell;
		const emailCell = req.query.emailCell;
		const discordIdCell = req.query.discordIdCell;

		const [phoneNumberHeader, emailHeader, discordIdHeader] =
			await Promise.all([
				getCell(spreadSheetId, sheetName, phoneNumberCell),
				getCell(spreadSheetId, sheetName, emailCell),
				editCell(spreadSheetId, sheetName, discordIdCell, "discord_id"),
			]);

		res.send({
			success: true,
			data: {
				phoneNumberHeader: phoneNumberHeader,
				emailHeader: emailHeader,
				discordIdHeader: discordIdHeader,
			},
			message: "Sheet headers fetched succesfully.",
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
	}
};

export const getSheetHeadersController = async (
	req: TypedRequestQuery<typeof sheetHeadersValidatorV2.query>,
	res: Response,
) => {
	try {
		const sheetSplit = req.query.spreadSheetUrl.match(sheetRegex);
		if (!sheetSplit) throw new Error("No sheet found");
		const spreadSheetId = sheetSplit[1] as string;
		const sheetName = req.query.sheetName;
		const headerRow = parseInt(req.query.headerRow);
		const headerRowData = await getColumnData(spreadSheetId, sheetName, headerRow.toString());
		if (!headerRowData.values) throw new Error("No header data in sheet.");
		console.log(headerRowData.values);



		res.send({
			success: true,
			data: {
				
			},
			message: "Sheet headers fetched succesfully.",
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
	}
}

