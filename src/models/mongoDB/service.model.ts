import { Document, Schema, model, PopulatedDoc } from "mongoose";
import { CustomerDocument } from "./customer.model";

export type ServiceDocument = Document & {
  name: string;
  guildId: string;
  creator: PopulatedDoc<CustomerDocument & Document>;
  roles: string[];
  isCustom: boolean;
  customIntegrationId?: string;
  integrationType: "tagMango" | "sheets";
  status: "active" | "inactive" | "paymentPending";
};

const ServiceSchema = new Schema<ServiceDocument>(
  {
    name: { type: String, required: true },
    guildId: { type: String, required: true },
    creator: {
      type: Schema.Types.ObjectId,
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
  { timestamps: true }
);

export default model<ServiceDocument>("service", ServiceSchema);
