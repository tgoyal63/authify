import { Document, Schema, model } from "mongoose";

export type TmSubscriberDocument = Document & {
  discordId?: string;
  tmId: string;
  email: string;
  phone: number;
  name: string;
  country: string;
  linkedDiscord: boolean;
  discordLinkTimestamp?: Date;
  updatedAt: Date;
  createdAt: Date;
};

const TmSubscriberSchema = new Schema<TmSubscriberDocument>(
  {
    discordId: { type: String, unique: true, sparse: true },
    tmId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    linkedDiscord: { type: Boolean, required: true, default: false },
    discordLinkTimestamp: { type: Date, default: null },
  },
  { timestamps: true }
);

export default model<TmSubscriberDocument>("attackMode", TmSubscriberSchema);
