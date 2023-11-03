import { google } from "googleapis";

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
		throw error;
	}
};

export const getColumnData = async (
	spreadsheetId: string,
	sheetName: string,
	column: string,
) => {
	try {
		const sheetData = await googleSheets.spreadsheets.values.get({
			auth,
			spreadsheetId,
			range: `'${sheetName}'!${column}:${column}`,
		});
		return sheetData.data;
	} catch (error) {
		throw error;
	}
};

export const getInternalSheet = async (
	spreadsheetId: string,
	sheetId: number,
) => {
	try {
		const allSheets = await getInternalSheets(spreadsheetId);
		const sheet = allSheets?.find(
			(sheet) => sheet.properties?.sheetId == sheetId,
		);
		return sheet;
	} catch (error) {
		throw error;
	}
};

export const getSheetData = async (spreadsheetId: string, sheetId: number) => {
	try {
		const sheet = await getInternalSheet(spreadsheetId, sheetId);
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

export const getCell = async (
	spreadsheetId: string,
	sheetId: number,
	cell: string,
) => {
	try {
		const sheet = await getInternalSheet(spreadsheetId, sheetId);
		const sheetData = await googleSheets.spreadsheets.values.get({
			auth,
			spreadsheetId,
			range: `'${sheet?.properties?.title}'!${cell}`,
		});
		return sheetData.data.values?.[0]?.[0];
	} catch (error) {
		throw error;
	}
};

export const editCell = async (
	spreadsheetId: string,
	sheetId: number,
	cell: string,
	value: string,
) => {
	try {
		const sheet = await getInternalSheet(spreadsheetId, sheetId);
		const sheetData = await googleSheets.spreadsheets.values.update({
			auth,
			spreadsheetId,
			range: `'${sheet?.properties?.title}'!${cell}`,
			valueInputOption: "USER_ENTERED",
			includeValuesInResponse: true,
			requestBody: {
				values: [[value]],
			},
		});
		return sheetData.data.updatedData?.values?.[0]?.[0];
	} catch (error) {
		throw error;
	}
};

export const editCellWithSheetName = async (
	spreadsheetId: string,
	sheetName: string,
	cell: string,
	value: string,
) => {
	try {
		console.log("spreadsheetId", spreadsheetId);
		console.log("cell", cell);
		console.log("sheetName", sheetName);
		console.log("value", value);
		const sheetData = await googleSheets.spreadsheets.values.update({
			auth,
			spreadsheetId,
			range: `'${sheetName}'!${cell}`,
			valueInputOption: "USER_ENTERED",
			includeValuesInResponse: true,
			requestBody: {
				values: [[value]],
			},
		});
		return sheetData.data.updatedData?.values?.[0]?.[0];
	} catch (error) {}
};
