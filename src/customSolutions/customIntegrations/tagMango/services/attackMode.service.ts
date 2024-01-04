import attackModeModel from "../models/attackMode.model";

interface AttackModeSubscriber {
    discordId: string;
    tmId: string;
    email: string;
    phone: number;
    name: string;
    linkedDiscord: boolean;
    discordLinkTimestamp: Date;
}

export const addOrUpdateSubscriber = async (
    data: AttackModeSubscriber,
) => {
    const subscriber = attackModeModel.findOneAndUpdate(
        { tmId: data.tmId },
        data,
        { upsert: true, new: true },
    );
    return subscriber;
};

export const addOrUpdateMultipleSubscribers = async (
    data: AttackModeSubscriber[],
) => {
    const subscribers = attackModeModel.updateMany(
        { tmId: { $in: data.map((d) => d.tmId) } },
        data,
        { upsert: true, new: true },
    );
    return subscribers;
};

export const getSubscriber = async (tmId: string) => {
    const subscriber = attackModeModel.findOne({ tmId });
    return subscriber;
};

export const getAllSubscribers = async () => {
    const subscribers = attackModeModel.find({});
    return subscribers;
};

export const getSubscriberByDiscordId = async (discordId: string) => {
    const subscribers = attackModeModel.find({ discordId });
    return subscribers;
};
