import attackModeModel from "../models/attackMode.model";

interface AttackModeSubscriber {
  discordId: string;
  tmId: string;
  email: string;
  phone: number;
  name: string;
  country: string;
  linkedDiscord: boolean;
  discordLinkTimestamp: Date;
}

export const addOrUpdateSubscriber = async (
  data: Partial<AttackModeSubscriber>
) => {
  return attackModeModel
    .findOneAndUpdate({ tmId: data.tmId }, data, { upsert: true, new: true })
    .exec();
};

export const addOrUpdateMultipleSubscribers = async (
  data: Partial<AttackModeSubscriber>[]
) => {
  return attackModeModel.bulkWrite(
    data.map((subscriber) => ({
      updateOne: {
        filter: { tmId: subscriber.tmId },
        update: subscriber,
        upsert: true,
      },
    }))
  );
};

export const getSubscriberByTmId = async (tmId: string) => {
  return attackModeModel.findOne({ tmId }).exec();
};

export const getAllSubscribers = async () => {
  return attackModeModel.find({}).exec();
};

export const getSubscriberByDiscordId = async (discordId: string) => {
  return attackModeModel.findOne({ discordId }).exec();
};

export const getSubscriberByPhone = async (phone: number) => {
  return attackModeModel.findOne({ phone }).exec();
};

export const getSubscriberByEmail = async (email: string) => {
  return attackModeModel.findOne({ email }).exec();
};

export const getSubscriber = async (
  query: Partial<
    Pick<AttackModeSubscriber, "discordId" | "tmId" | "email" | "phone">
  >
) => {
  return attackModeModel.findOne(query).exec();
};
