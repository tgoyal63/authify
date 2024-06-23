import { Document, Schema, model, PopulatedDoc } from "mongoose";
import { CustomerDocument } from "@/models/mongoDB/customer.model";
import { ServiceDocument } from "@/models/mongoDB/service.model";

export type TmCredentialDocument = Document & {
  customer: PopulatedDoc<CustomerDocument & Document>;
  accessToken: string;
  refreshToken: string;
  phone: number;
  domain: string;
  service: PopulatedDoc<ServiceDocument & Document>;
  createdAt: Date;
  updatedAt: Date;
};

const TmCredentialSchema = new Schema<TmCredentialDocument>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    phone: { type: Number, required: true },
    domain: { type: String, required: true },
    service: {
      type: Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<TmCredentialDocument>("tmCredential", TmCredentialSchema);
