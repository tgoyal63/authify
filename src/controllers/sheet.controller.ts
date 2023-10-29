import { Response } from "express";
import { getInternalSheets } from "../utils/sheet.utils";
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
		const sheetId = sheetSplit[1] as string;

		const internalSheetData = await getInternalSheets(sheetId);
		if (!internalSheetData) {
			res.send({ success: false, message: "No sheet found" });
			return;
		}
		res.send({
			success: true,
			data: internalSheetData,
			message: "Internal sheet data fetched succesfully.",
		});
	} catch (error) {
		console.log(error);
	}
};
