import { z } from "zod";

export const sheetRegex =
	/https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)\//;

export const cellOfASpreadSheetRegex = /^[A-Z]+[0-9]+$/;

export const getInternalSheetValidator = {
	query: z.object({
		spreadSheetUrl: z.string().regex(sheetRegex),
	}),
};

export const sheetHeadersValidator = {
	query: z.object({
		spreadSheetUrl: z.string().regex(sheetRegex),
		sheetId: z.string().regex(/^\d+$/),
		phoneCell: z.string().regex(cellOfASpreadSheetRegex),
		emailCell: z.string().regex(cellOfASpreadSheetRegex),
		discordIdCell: z.string().regex(cellOfASpreadSheetRegex),
	}),
};
