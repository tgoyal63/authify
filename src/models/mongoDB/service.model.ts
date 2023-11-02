import mongoose from "mongoose";
import { CustomerDocument } from "./customer.model";
import { SpreadsheetDocument } from "./spreadsheet.models";

export type ServiceDocument = mongoose.Document & {
	guildId: string;
	creator: mongoose.PopulatedDoc<CustomerDocument & mongoose.Document>;
	spreadsheet: mongoose.PopulatedDoc<SpreadsheetDocument & mongoose.Document>;
};

const ServiceSchema = new mongoose.Schema(
	{
		guildId: { type: String, required: true },
		spreadsheet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "spreadsheet",
			unique: true,
			sparse: true,
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "customer",
		},
	},
	{ timestamps: true },
);

export default mongoose.model<ServiceDocument>("service", ServiceSchema);
