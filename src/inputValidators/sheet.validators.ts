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
    sheetName: z.string(),
    phoneCell: z.string().regex(cellOfASpreadSheetRegex),
    emailCell: z.string().regex(cellOfASpreadSheetRegex),
    discordIdCell: z.string().regex(cellOfASpreadSheetRegex),
  }),
};

export const sheetHeadersValidatorV2 = {
  query: z.object({
    spreadSheetUrl: z.string().regex(sheetRegex),
    sheetName: z.string(),
    headerRow: z.string().regex(/^\d+$/),
  }),
};
