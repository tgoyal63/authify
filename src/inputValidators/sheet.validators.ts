import { z } from "zod";

export const sheetRegex =
	/https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)\//;

export const getInternalSheetValidator = {
	query: z.object({
		sheetUrl: z.string().regex(sheetRegex),
	}),
};
