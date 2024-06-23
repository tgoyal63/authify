import { Document, Schema, model, PopulatedDoc } from "mongoose";
import { ServiceDocument } from "./service.model";

export type SpreadsheetDocument = Document & {
  service: PopulatedDoc<ServiceDocument & Document>;
  phoneNumberColumn: string;
  emailColumn: string;
  discordIdColumn: string;
  headerRow: number;
  sheetName: string;
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetId: number;
  guildId: string;
};

const SpreadsheetSchema = new Schema<SpreadsheetDocument>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    phoneNumberColumn: { type: String, required: true },
    emailColumn: { type: String, required: true },
    discordIdColumn: { type: String, required: true },
    headerRow: { type: Number, required: true },
    sheetName: { type: String, required: true },
    spreadsheetId: { type: String, required: true },
    spreadsheetUrl: { type: String, required: true },
    sheetId: { type: Number, required: true },
    guildId: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<SpreadsheetDocument>("spreadsheet", SpreadsheetSchema);
