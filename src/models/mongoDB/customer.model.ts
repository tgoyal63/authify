import { Document, Schema, model, PopulatedDoc } from "mongoose";
import { CredentialDocument } from "./credentials.model";

export type CustomerDocument = Document & {
  username: string;
  phone?: number;
  email: string;
  discordId: string;
  discordCredentials: PopulatedDoc<CredentialDocument & Document>;
};

const CustomerSchema = new Schema<CustomerDocument>(
  {
    username: { type: String, required: true },
    phone: { type: Number, unique: true, sparse: true },
    email: { type: String, unique: true, required: true },
    discordId: { type: String, unique: true, required: true },
    discordCredentials: {
      type: Schema.Types.ObjectId,
      ref: "credential",
      unique: true,
    },
  },
  { timestamps: true }
);

export default model<CustomerDocument>("customer", CustomerSchema);
