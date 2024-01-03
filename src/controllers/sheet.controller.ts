import { Response } from "express";
import { TypedRequestQuery } from "zod-express-middleware";
import {
    getInternalSheetValidator,
    sheetHeadersValidator,
    sheetHeadersValidatorV2,
    sheetRegex,
} from "@/inputValidators/sheet.validators";
import {
    editCell,
    getCell,
    getColumnData,
    getInternalSheets,
} from "@/utils/sheet.utils";
import { ApiHandler } from "@/utils/api-handler.util";

export const getInternalSheetController = ApiHandler(
    async (
        req: TypedRequestQuery<typeof getInternalSheetValidator.query>,
        res: Response,
    ) => {
        const sheetSplit = req.query.spreadSheetUrl.match(sheetRegex);
        if (!sheetSplit)
            return res.send({ success: false, message: "No sheet found" });

        const spreadSheetId = sheetSplit[1] as string;
        const internalSheetData = await getInternalSheets(spreadSheetId);
        if (!internalSheetData)
            return res.send({ success: false, message: "No sheet found" });

        const responseData = internalSheetData.map((sheet) => {
            return {
                sheetId: sheet.properties?.sheetId,
                title: sheet.properties?.title,
                index: sheet.properties?.index,
            };
        });
        return res.send({
            success: true,
            data: responseData,
            message: "Internal sheet data fetched succesfully.",
        });
    },
);

export const validateSheetHeadersController = ApiHandler(
    async (
        req: TypedRequestQuery<typeof sheetHeadersValidator.query>,
        res: Response,
    ) => {
        const sheetSplit = req.query.spreadSheetUrl.match(sheetRegex);
        if (!sheetSplit) throw new Error("No sheet found");
        const spreadSheetId = sheetSplit[1] as string;
        const sheetName = req.query.sheetName;
        const phoneNumberCell = req.query.phoneCell;
        const emailCell = req.query.emailCell;
        const discordIdCell = req.query.discordIdCell;

        const [phoneNumberHeader, emailHeader, discordIdHeader] =
            await Promise.all([
                getCell(spreadSheetId, sheetName, phoneNumberCell),
                getCell(spreadSheetId, sheetName, emailCell),
                editCell(spreadSheetId, sheetName, discordIdCell, "discord_id"),
            ]);

        res.send({
            success: true,
            data: {
                phoneNumberHeader: phoneNumberHeader,
                emailHeader: emailHeader,
                discordIdHeader: discordIdHeader,
            },
            message: "Sheet headers fetched succesfully.",
        });
    },
);

export const getSheetHeadersController = ApiHandler(
    async (
        req: TypedRequestQuery<typeof sheetHeadersValidatorV2.query>,
        res: Response,
    ) => {
        const sheetSplit = req.query.spreadSheetUrl.match(sheetRegex);
        if (!sheetSplit) throw new Error("No sheet found");
        const spreadSheetId = sheetSplit[1] as string;
        const sheetName = req.query.sheetName;
        const headerRow = parseInt(req.query.headerRow);
        const headerRowData = await getColumnData(
            spreadSheetId,
            sheetName,
            headerRow.toString(),
        );
        if (!headerRowData.values) throw new Error("No header data in sheet.");
        if (headerRowData.values.length !== 1) throw new Error("Invalid Row");
        if (!headerRowData.values[0]) throw new Error("Invalid Row");
        if (headerRowData.values[0].length === 0)
            throw new Error("Invalid Row");
        res.send({
            success: true,
            data: headerRowData.values[0],
            message: "Sheet headers fetched succesfully.",
        });
    },
);
