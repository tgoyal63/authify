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
    res: Response
  ) => {
    const sheetSplit = req.query.spreadSheetUrl.match(sheetRegex);
    if (!sheetSplit) {
      return res.send({ success: false, message: "No sheet found" });
    }

    const spreadSheetId = sheetSplit[1] as string;
    const internalSheetData = await getInternalSheets(spreadSheetId);
    if (!internalSheetData) {
      return res.send({ success: false, message: "No sheet found" });
    }

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
      message: "Internal sheet data fetched successfully.",
    });
  }
);

export const validateSheetHeadersController = ApiHandler(
  async (
    req: TypedRequestQuery<typeof sheetHeadersValidator.query>,
    res: Response
  ) => {
    const sheetSplit = req.query.spreadSheetUrl.match(sheetRegex);
    if (!sheetSplit) throw new Error("No sheet found");

    const spreadSheetId = sheetSplit[1] as string;
    const { sheetName, phoneCell, emailCell, discordIdCell } = req.query;

    const [phoneNumberHeader, emailHeader, discordIdHeader] = await Promise.all(
      [
        getCell(spreadSheetId, sheetName, phoneCell),
        getCell(spreadSheetId, sheetName, emailCell),
        editCell(spreadSheetId, sheetName, discordIdCell, "discord_id"),
      ]
    );

    res.send({
      success: true,
      data: {
        phoneNumberHeader,
        emailHeader,
        discordIdHeader,
      },
      message: "Sheet headers fetched successfully.",
    });
  }
);

export const getSheetHeadersController = ApiHandler(
  async (
    req: TypedRequestQuery<typeof sheetHeadersValidatorV2.query>,
    res: Response
  ) => {
    const sheetSplit = req.query.spreadSheetUrl.match(sheetRegex);
    if (!sheetSplit) throw new Error("No sheet found");

    const spreadSheetId = sheetSplit[1] as string;
    const { sheetName, headerRow } = req.query;
    const headerRowData = await getColumnData(
      spreadSheetId,
      sheetName,
      headerRow.toString()
    );

    if (
      !headerRowData.values ||
      headerRowData.values.length !== 1 ||
      !headerRowData.values[0] ||
      headerRowData.values[0].length === 0
    ) {
      throw new Error("Invalid Row");
    }

    res.send({
      success: true,
      data: headerRowData.values[0],
      message: "Sheet headers fetched successfully.",
    });
  }
);
