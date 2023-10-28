import mongoose from "mongoose";
import { CustomerDocument } from "./customer.model";

export type ServiceDocument = mongoose.Document & {
	serverId: string;
	status: "payment_pending" | "active" | "inactive";
	subscriptionStart?: Date;
	subscriptionEnd?: Date;
	managingCustomers: Array<
		mongoose.PopulatedDoc<CustomerDocument & mongoose.Document>
	>;
	creator: mongoose.PopulatedDoc<CustomerDocument & mongoose.Document>;
};

const ServiceSchema = new mongoose.Schema(
	{
		serverId: { type: String, required: true },
		status: {
			type: String,
			enum: ["payment_pending", "active", "inactive"],
			default: "inactive",
			required: true,
		},
		managingCustomers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Customer",
			},
		],
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Customer",
		},
	},
	{ timestamps: true },
);

export default mongoose.model<ServiceDocument>("service", ServiceSchema);
