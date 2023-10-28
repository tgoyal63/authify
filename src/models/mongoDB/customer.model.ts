import mongoose from "mongoose";
import { CredentialDocument } from "./credentials.model";

export type CustomerDocument = mongoose.Document & {
	username: string;
	phone: number;
	email: string;
	discordId: string;
	discordCredentials: mongoose.PopulatedDoc<
		CredentialDocument & mongoose.Document
	>;
};

const CustomerSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		phone: { type: Number, unique: true, sparse: true },
		email: { type: String, unique: true, required: true },
		discordId: { type: String, unique: true, required: true },
		discordCredentials: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "credential",
			unique: true,
		},
	},
	{ timestamps: true },
);
export default mongoose.model<CustomerDocument>("customer", CustomerSchema);
