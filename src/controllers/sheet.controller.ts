import { Response } from "express";
import { getInternalSheets, getSheetData } from "../utils/sheet.utils";
import { TypedRequestQuery } from "zod-express-middleware";
import {
	getInternalSheetValidator,
	getSheetHeadersValidator,
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

export const getSheetHeadersController = async (
	req: TypedRequestQuery<typeof getSheetHeadersValidator.query>,
	res: Response,
) => {
	try {
		const sheetSplit = req.query.spreadSheetUrl.match(sheetRegex);
		if (!sheetSplit) throw new Error("No sheet found");
		const spreadSheetId = sheetSplit[1] as string;
		const sheetId = parseInt(req.query.sheetId);
		const sheetData = await getSheetData(spreadSheetId, sheetId);
		const headers = sheetData.values?.shift();
		res.send({
			success: true,
			data: headers,
			message: "Data fetched successfully",
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
	}
};
