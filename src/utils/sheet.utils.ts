import { google } from "googleapis";
import { GaxiosError } from "gaxios";

const auth = new google.auth.GoogleAuth({
	keyFile: "google-credentials.json",
	scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const googleSheets = google.sheets({ version: "v4", auth });

export const getInternalSheets = async (spreadsheetId: string) => {
	try {
		const metaData = await googleSheets.spreadsheets.get({
			auth,
			spreadsheetId,
		});

		return metaData.data.sheets;
	} catch (error) {
		if (error instanceof GaxiosError) {
			if (error.message == "Requested entity was not found.") return null;
		}
		throw error;
	}
};

export const getSheetData = async (spreadsheetId: string, sheetId: number) => {
	try {
		const allSheets = await getInternalSheets(spreadsheetId);
		const sheet = allSheets?.find(
			(sheet) => sheet.properties?.sheetId == sheetId,
		);
		const sheetData = await googleSheets.spreadsheets.values.get({
			auth,
			spreadsheetId,
			range: sheet?.properties?.title as string,
		});
		return sheetData.data;
	} catch (error) {
		throw error;
	}
};
