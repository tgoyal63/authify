import { google } from "googleapis";
import { GaxiosError } from "gaxios";

const auth = new google.auth.GoogleAuth({
	keyFile: "google-credentials.json",
	scopes: "https://www.googleapis.com/auth/spreadsheets",
});

export const getInternalSheets = async (spreadsheetId: string) => {
	try {
		const googleSheets = google.sheets({ version: "v4", auth });

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
