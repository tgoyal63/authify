import { google, sheets_v4 } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "google-credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const googleSheets: sheets_v4.Sheets = google.sheets({ version: "v4", auth });

/**
 * Gets the internal sheets of a Google Spreadsheet
 * @param spreadsheetId The ID of the Google Spreadsheet
 * @returns An array of sheets within the spreadsheet
 * @throws {Error} If the request to Google Sheets API fails
 */
export const getInternalSheets = async (
  spreadsheetId: string
): Promise<sheets_v4.Schema$Sheet[] | undefined> => {
  if (!spreadsheetId) {
    throw new Error("Spreadsheet ID is required to get internal sheets.");
  }

  try {
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
    return metaData.data.sheets;
  } catch (error) {
    console.error("Error fetching internal sheets:", error);
    throw error;
  }
};

/**
 * Gets data from a specific column in a Google Spreadsheet
 * @param spreadsheetId The ID of the Google Spreadsheet
 * @param sheetName The name of the sheet
 * @param column The column to fetch data from
 * @returns The data from the specified column
 * @throws {Error} If the request to Google Sheets API fails
 */
export const getColumnData = async (
  spreadsheetId: string,
  sheetName: string,
  column: string
): Promise<sheets_v4.Schema$ValueRange> => {
  if (!spreadsheetId || !sheetName || !column) {
    throw new Error(
      "Spreadsheet ID, sheet name, and column are required to get column data."
    );
  }

  try {
    const sheetData = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `'${sheetName}'!${column}:${column}`,
    });
    return sheetData.data;
  } catch (error) {
    console.error("Error fetching column data:", error);
    throw error;
  }
};

/**
 * Gets a specific sheet from a Google Spreadsheet
 * @param spreadsheetId The ID of the Google Spreadsheet
 * @param sheetId The ID of the sheet to fetch
 * @returns The requested sheet
 * @throws {Error} If the request to Google Sheets API fails
 */
export const getInternalSheet = async (
  spreadsheetId: string,
  sheetId: number
): Promise<sheets_v4.Schema$Sheet | undefined> => {
  if (!spreadsheetId || sheetId === undefined) {
    throw new Error(
      "Spreadsheet ID and sheet ID are required to get internal sheet."
    );
  }

  try {
    const allSheets = await getInternalSheets(spreadsheetId);
    const sheet = allSheets?.find(
      (sheet) => sheet.properties?.sheetId === sheetId
    );
    return sheet;
  } catch (error) {
    console.error("Error fetching internal sheet:", error);
    throw error;
  }
};

/**
 * Gets data from a specific sheet in a Google Spreadsheet
 * @param spreadsheetId The ID of the Google Spreadsheet
 * @param sheetName The name of the sheet
 * @returns The data from the specified sheet
 * @throws {Error} If the request to Google Sheets API fails
 */
export const getSheetData = async (
  spreadsheetId: string,
  sheetName: string
): Promise<sheets_v4.Schema$ValueRange> => {
  if (!spreadsheetId || !sheetName) {
    throw new Error(
      "Spreadsheet ID and sheet name are required to get sheet data."
    );
  }

  try {
    const sheetData = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: sheetName,
    });
    return sheetData.data;
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    throw error;
  }
};

/**
 * Gets the value of a specific cell in a Google Spreadsheet
 * @param spreadsheetId The ID of the Google Spreadsheet
 * @param sheetName The name of the sheet
 * @param cell The cell to fetch the value from
 * @returns The value of the specified cell
 * @throws {Error} If the request to Google Sheets API fails
 */
export const getCell = async (
  spreadsheetId: string,
  sheetName: string,
  cell: string
): Promise<string | undefined> => {
  if (!spreadsheetId || !sheetName || !cell) {
    throw new Error(
      "Spreadsheet ID, sheet name, and cell are required to get cell value."
    );
  }

  try {
    const sheetData = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `'${sheetName}'!${cell}`,
    });
    return sheetData.data.values?.[0]?.[0];
  } catch (error) {
    console.error("Error fetching cell value:", error);
    throw error;
  }
};

/**
 * Updates the value of a specific cell in a Google Spreadsheet
 * @param spreadsheetId The ID of the Google Spreadsheet
 * @param sheetName The name of the sheet
 * @param cell The cell to update
 * @param value The new value for the cell
 * @returns The updated value of the specified cell
 * @throws {Error} If the request to Google Sheets API fails
 */
export const editCell = async (
  spreadsheetId: string,
  sheetName: string,
  cell: string,
  value: string
): Promise<string | undefined> => {
  if (!spreadsheetId || !sheetName || !cell || !value) {
    throw new Error(
      "Spreadsheet ID, sheet name, cell, and value are required to update cell value."
    );
  }

  try {
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
  } catch (error) {
    console.error("Error updating cell value:", error);
    throw error;
  }
};
