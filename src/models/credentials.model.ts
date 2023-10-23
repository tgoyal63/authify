import mongoose, { PopulatedDoc, Document } from "mongoose";
import { CustomerDocument } from "./customer.model";

export type CredentialDocument = mongoose.Document & {
	customer: PopulatedDoc<CustomerDocument & Document>;
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
	scope: string;
};

const CredentialSchema = new mongoose.Schema(
	{
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "customer",
			required: true,
		},
		accessToken: { type: String, required: true },
		refreshToken: { type: String, required: true },
		expiresAt: { type: Date, required: true },
		scope: { type: String, required: true },
	},
	{ timestamps: true },
);
export default mongoose.model<CredentialDocument>(
	"credential",
	CredentialSchema,
);
