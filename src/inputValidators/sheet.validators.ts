import { z } from "zod";

export const sheetRegex =
  /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)\//;

export const cellOfASpreadSheetRegex = /^[A-Z]+[0-9]+$/;

export const getInternalSheetValidator = {
  query: z.object({
    spreadSheetUrl: z
      .string()
      .regex(sheetRegex, { message: "Invalid spreadsheet URL format." }),
  }),
};

export const sheetHeadersValidator = {
  query: z.object({
    spreadSheetUrl: z
      .string()
      .regex(sheetRegex, { message: "Invalid spreadsheet URL format." }),
    sheetName: z.string(),
    phoneCell: z
      .string()
      .regex(cellOfASpreadSheetRegex, {
        message: "Invalid cell format for phone number.",
      }),
    emailCell: z
      .string()
      .regex(cellOfASpreadSheetRegex, {
        message: "Invalid cell format for email.",
      }),
    discordIdCell: z
      .string()
      .regex(cellOfASpreadSheetRegex, {
        message: "Invalid cell format for Discord ID.",
      }),
  }),
};

export const sheetHeadersValidatorV2 = {
  query: z.object({
    spreadSheetUrl: z
      .string()
      .regex(sheetRegex, { message: "Invalid spreadsheet URL format." }),
    sheetName: z.string(),
    headerRow: z
      .string()
      .regex(/^\d+$/, { message: "Header row must be a number." }),
  }),
};
