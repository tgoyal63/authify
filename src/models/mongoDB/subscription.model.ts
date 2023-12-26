import mongoose from "mongoose";
import { CustomerDocument } from "./customer.model";
import { ServiceDocument } from "./service.model";

export type SubscriptionDocument = mongoose.Document & {
    customer: mongoose.PopulatedDoc<CustomerDocument & mongoose.Document>;
    service: mongoose.PopulatedDoc<ServiceDocument & mongoose.Document>;
    active: boolean;
    startsAt: Date;
    endsAt: Date;
    testingMode: boolean; // Testing mode is used to test the integration without paying for it
    testingModeEndsAt: Date | null;
};

const SubscriptionSchema = new mongoose.Schema(
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
        testingMode: { type: Boolean, default: false },
        testingModeEndsAt: { type: Date, default: null },
    },
    { timestamps: true },
);
export default mongoose.model<SubscriptionDocument>(
    "credential",
    SubscriptionSchema,
);
