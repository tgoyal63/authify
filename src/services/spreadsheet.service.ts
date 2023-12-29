import spreadsheetModel from "../models/mongoDB/spreadsheet.models";
import mongoose from "mongoose";

export const getSpreadsheetDataFromServiceId = async (serviceId: string) => {
    const spreadsheet = await spreadsheetModel
        .findOne({ service: serviceId })
        .populate({
            path: "service",
            populate: { path: "creator", select: "username -_id" },
        })
        .exec();
    return spreadsheet;
};

export const createSpreadsheet = async (spreadsheetData: {
    service: mongoose.Types.ObjectId;
    phoneNumberColumn: string;
    emailColumn: string;
    discordIdColumn: string;
    headerRow: number;
    sheetName: string;
    spreadsheetUrl: string;
    spreadsheetId: string;
    sheetId: number;
    guildId: string;
}) => {
    const spreadsheet = await spreadsheetModel.create(spreadsheetData);
    return spreadsheet;
};
