import { Request, Response } from "express";
import { getInternalSheets, getSheetData } from "../utils/sheet.utils";
import { TypedRequestQuery } from "zod-express-middleware";
import {
	getInternalSheetValidator,
	sheetRegex,
} from "../inputValidators/sheet.validators";

export const getInternalSheetController = async (
	req: TypedRequestQuery<typeof getInternalSheetValidator.query>,
	res: Response,
) => {
	try {
		const sheetSplit = req.query.sheetUrl.match(sheetRegex);
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

export const getSheetDataController = async (req: Request, res: Response) => {
	try {
		const shes = req.query?.["sheetUrl"] as string;
		const sheetSplit = shes.match(sheetRegex);
		if (!sheetSplit) {
			res.send({ success: false, message: "No sheet found" });
			return;
		}
		const sheetId = sheetSplit[1] as string;
		const data = await getSheetData(sheetId, 1897314246);
		res.send({ success: true, data, message: "Data fetched successfully" });
	} catch (error) {
		console.log(error);
	}
};
