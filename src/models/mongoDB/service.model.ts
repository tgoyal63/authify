import mongoose from "mongoose";
import { CustomerDocument } from "./customer.model";

export type ServiceDocument = mongoose.Document & {
    name: string;
    guildId: string;
    creator: mongoose.PopulatedDoc<CustomerDocument & mongoose.Document>;
    roles: string[];
    isCustom: boolean;
    customIntegrationId: string;
    integrationType: "tagMango" | "sheets";
    status: "active" | "inactive" | "paymentPending";
};

const ServiceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        guildId: { type: String, required: true },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "customer",
        },
        roles: [{ type: String, default: [] }],
        isCustom: { type: Boolean, default: false },
        customIntegrationId: {
            type: String,
            unique: true,
            sparse: true,
        },
        integrationType: {
            type: String,
            enum: ["tagMango", "sheets"],
            default: "sheets",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "paymentPending"],
            default: "inactive",
        },
    },
    { timestamps: true },
);

export default mongoose.model<ServiceDocument>("service", ServiceSchema);
