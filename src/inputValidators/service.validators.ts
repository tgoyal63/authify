import { z } from "zod";
import { cellOfASpreadSheetRegex, sheetRegex } from "./sheet.validators";

export const guildIdValidator = {
  query: z.object({
    guildId: z
      .string()
      .regex(/^\d+$/, { message: "Guild ID must be a number." })
      .min(15, { message: "Guild ID must be at least 15 characters long." })
      .max(20, { message: "Guild ID must be at most 20 characters long." }),
  }),
};

export const createServiceValidator = {
  body: z.object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." })
      .max(50, { message: "Name must be at most 50 characters long." }),
    spreadSheetUrl: z
      .string()
      .regex(sheetRegex, { message: "Invalid spreadsheet URL format." }),
    sheetId: z.coerce
      .number()
      .nonnegative({ message: "Sheet ID must be a non-negative number." }),
    phoneCell: z
      .string()
      .regex(cellOfASpreadSheetRegex, {
        message: "Invalid cell format for phone number.",
      }),
    discordIdCell: z
      .string()
      .regex(cellOfASpreadSheetRegex, {
        message: "Invalid cell format for Discord ID.",
      }),
    emailCell: z
      .string()
      .regex(cellOfASpreadSheetRegex, {
        message: "Invalid cell format for email.",
      }),
    roleIds: z.array(
      z
        .string()
        .regex(/^\d+$/, { message: "Role ID must be a number." })
        .min(15, { message: "Role ID must be at least 15 characters long." })
        .max(20, { message: "Role ID must be at most 20 characters long." })
    ),
    guildId: z
      .string()
      .regex(/^\d+$/, { message: "Guild ID must be a number." })
      .min(15, { message: "Guild ID must be at least 15 characters long." })
      .max(20, { message: "Guild ID must be at most 20 characters long." }),
    sheetName: z
      .string()
      .min(1, { message: "Sheet name must be at least 1 character long." })
      .max(25, { message: "Sheet name must be at most 25 characters long." }),
  }),
};

export const createTMServiceValidator = {
  body: z.object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." })
      .max(50, { message: "Name must be at most 50 characters long." }),
    roleIds: z.array(
      z
        .string()
        .regex(/^\d+$/, { message: "Role ID must be a number." })
        .min(15, { message: "Role ID must be at least 15 characters long." })
        .max(20, { message: "Role ID must be at most 20 characters long." })
    ),
    guildId: z
      .string()
      .regex(/^\d+$/, { message: "Guild ID must be a number." })
      .min(15, { message: "Guild ID must be at least 15 characters long." })
      .max(20, { message: "Guild ID must be at most 20 characters long." }),
  }),
};
