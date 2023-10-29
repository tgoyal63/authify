import { z } from "zod";

export const sheetRegex =
	/https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)\//;

export const getInternalSheetValidator = {
	query: z.object({
		spreadSheetUrl: z.string().regex(sheetRegex),
	}),
};

export const getSheetHeadersValidator = {
	query: z.object({
		spreadSheetUrl: z.string().regex(sheetRegex),
		sheetId: z.string().regex(/^\d+$/),
	}),
};
