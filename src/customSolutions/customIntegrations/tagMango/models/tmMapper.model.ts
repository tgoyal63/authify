import { Document, Schema, model, PopulatedDoc } from "mongoose";
import { CustomerDocument } from "@/models/mongoDB/customer.model";
import { ServiceDocument } from "@/models/mongoDB/service.model";
import { TmCredentialDocument } from "./tmCredential.model";

export type TmMapperDocument = Document & {
  mango: string;
  service: PopulatedDoc<ServiceDocument & Document>;
  tmCredential: PopulatedDoc<TmCredentialDocument & Document>;
  customer: PopulatedDoc<CustomerDocument & Document>;
  metadata: Record<string, unknown>;
  customIntegrationId: string;
};

const TmMapperSchema = new Schema<TmMapperDocument>(
  {
    mango: { type: String, required: true, unique: true },
    service: {
      type: Schema.Types.ObjectId,
      ref: "service",
      unique: true,
    },
    tmCredential: {
      type: Schema.Types.ObjectId,
      ref: "tmCredential",
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customer",
    },
    metadata: { type: Object, default: {} },
    customIntegrationId: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<TmMapperDocument>("tmMapper", TmMapperSchema);
