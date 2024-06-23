import { Document, Schema, model, PopulatedDoc } from "mongoose";
import { CustomerDocument } from "./customer.model";
import { ServiceDocument } from "./service.model";

export type SubscriptionDocument = Document & {
  customer: PopulatedDoc<CustomerDocument & Document>;
  service: PopulatedDoc<ServiceDocument & Document>;
  active: boolean;
  startsAt: Date;
  endsAt: Date;
  testingMode: boolean;
  testingModeEndsAt: Date | null;
};

const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    active: { type: Boolean, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    testingMode: { type: Boolean, default: false },
    testingModeEndsAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default model<SubscriptionDocument>("subscription", SubscriptionSchema);
