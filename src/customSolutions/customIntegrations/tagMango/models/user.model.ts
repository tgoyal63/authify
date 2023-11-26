import mongoose from "mongoose";
import { ServiceDocument } from "../../../../models/mongoDB/service.model";

export type TmSubscriberDocument = mongoose.Document & {
	discordId: string;
	tmId: string;
	email: string;
	phone: number;
	name: string;
	linkedDiscord: boolean;
	expiresAt: Date;
	service: mongoose.PopulatedDoc<ServiceDocument & mongoose.Document>;
	customIntegrationId: string;
    discordLinkTimestamp: Date;
};

const TmSubscriberSchema = new mongoose.Schema(
	{
		discordId: { type: String, required: true },
		tmId: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: Number, required: true },
		name: { type: String, required: true },
		linkedDiscord: { type: Boolean, required: true },
		expiresAt: { type: Date, required: true },
		service: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "service",
			required: true,
		},
		customIntegrationId: { type: String, required: true },
        discordLinkTimestamp: { type: Date, required: true },
	},
	{ timestamps: true },
);
export default mongoose.model<TmSubscriberDocument>(
	"tmSubscriber",
	TmSubscriberSchema,
);
