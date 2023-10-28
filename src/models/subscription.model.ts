import mongoose from "mongoose";
import { CustomerDocument } from "./customer.model";
import { ServiceDocument } from "./service.model";

export type CredentialDocument = mongoose.Document & {
	customer: mongoose.PopulatedDoc<CustomerDocument & mongoose.Document>;
	service: mongoose.PopulatedDoc<ServiceDocument & mongoose.Document>;
	active: boolean;
	startsAt: Date;
	EndsAt: Date;
};

const CredentialSchema = new mongoose.Schema(
	{
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "customer",
			required: true,
		},
		service: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "service",
			required: true,
		},
		active: { type: Boolean, required: true },
		startsAt: { type: Date, required: true },
		endsAt: { type: Date, required: true },
	},
	{ timestamps: true },
);
export default mongoose.model<CredentialDocument>(
	"credential",
	CredentialSchema,
);
