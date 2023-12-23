import { z } from "zod";

import { cellOfASpreadSheetRegex, sheetRegex } from "./sheet.validators";

export const guildIdValidator = {
    query: z.object({
        guildId: z.string().regex(/^\d+$/).min(15).max(20),
    }),
};

export const createServiceValidator = {
    body: z.object({
        name: z.string().min(3).max(50),
        spreadSheetUrl: z.string().regex(sheetRegex),
        sheetId: z.coerce.number().nonnegative(),
        phoneCell: z.string().regex(cellOfASpreadSheetRegex),
        discordIdCell: z.string().regex(cellOfASpreadSheetRegex),
        emailCell: z.string().regex(cellOfASpreadSheetRegex),
        roleIds: z.array(z.string().regex(/^\d+$/).min(15).max(20)),
        guildId: z.string().regex(/^\d+$/).min(15).max(20),
        sheetName: z.string().min(1).max(25),
        integrationType: z.enum(["sheets", "tagMango"]),
    }),
};
