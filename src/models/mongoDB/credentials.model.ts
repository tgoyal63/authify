import { Document, Schema, model, PopulatedDoc } from "mongoose";
import { CustomerDocument } from "./customer.model";

export type CredentialDocument = Document & {
  customer: PopulatedDoc<CustomerDocument & Document>;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scope: string;
};

const CredentialSchema = new Schema<CredentialDocument>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    scope: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<CredentialDocument>("credential", CredentialSchema);
