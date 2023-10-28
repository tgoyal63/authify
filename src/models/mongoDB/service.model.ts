import mongoose from "mongoose";
import { CustomerDocument } from "./customer.model";
import { SubscriptionDocument } from "./subscription.model";

export type ServiceDocument = mongoose.Document & {
	guildId: string;
	status: "payment_pending" | "active" | "inactive";
	subscription: mongoose.PopulatedDoc<
		SubscriptionDocument & mongoose.Document
	>;
	managingCustomers: Array<
		mongoose.PopulatedDoc<CustomerDocument & mongoose.Document>
	>;
	creator: mongoose.PopulatedDoc<CustomerDocument & mongoose.Document>;
};

const ServiceSchema = new mongoose.Schema(
	{
		guildId: { type: String, required: true },
		status: {
			type: String,
			enum: ["payment_pending", "active", "inactive"],
			default: "inactive",
			required: true,
		},
		subscription: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subscription",
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
