import { getSubscribers } from "../customIntegrations/tagMango/apiWrapper";
import router from "../customIntegrations/tagMango/routes";
import { CustomSolution } from "../types";
import { getMangoDetails } from "../customIntegrations/tagMango/services/tmMapper.service";
import {
    addOrUpdateSubscriber,
    getSubscriber,
} from "../customIntegrations/tagMango/services/attackMode.service";
import { DiscordError } from "@/types/error/discord-error";

router.get("/", async (req, res) => {
    res.send("Welcome to Gangsta Philosophy!");
});

const subscriberValidator = async (
    mangoes: string,
    term: string | number,
    discordId: string,
) => {
    const mangoData = await getMangoDetails(mangoes);
    if (!mangoData) throw new DiscordError("Mango not found", false);
    const { customer } = mangoData;

    // Fetching from tagMango
    let subscriber = await getSubscribers({
        type: "active",
        term,
        mangoes,
        customerId: customer,
    });

    // if subscriber doesn't exist, return false
    if (subscriber.length === 0) return false;

    // check if subscriber is an array of length 1
    if (subscriber.length !== 1)
        throw new DiscordError(
            "Multiple subscribers found, for the same mango and term!",
            false,
        );

    subscriber = subscriber[0];

    // Fetching from attackmode db
    const dbSubscriber = await getSubscriber(subscriber.fanId);

    // if dbSubscriber doesn't exist, add it and return true
    if (!dbSubscriber) {
        const newSubscriber = {
            tmId: subscriber.fanId,
            email: subscriber.fanEmail,
            phone: subscriber.fanPhone,
            name: subscriber.fanName,
            country: subscriber.fanCountry,
            discordId,
            linkedDiscord: true,
            discordLinkTimestamp: new Date(),
        };
        const data = addOrUpdateSubscriber(newSubscriber);
        if (!data) throw new DiscordError("Failed to add subscriber!", false);
        return true;
    }

    // check if dbSubscriber has discordId and if it has return false
    if (dbSubscriber.discordId && dbSubscriber.discordId === discordId)
        return true;

    // if dbSubscriber has discordId but it's different, throw error
    if (dbSubscriber.discordId && dbSubscriber.discordId !== discordId)
        throw new DiscordError(
            `${term} already linked to another Discord Account!`,
            true,
        );

    // check if dbSubscriber has same phone number and email, return true
    if (
        dbSubscriber.email === subscriber.fanEmail &&
        dbSubscriber.phone === subscriber.fanPhone
    )
        return true;

    // if dbSubscriber has different phone number and email, update it and return true
    if (
        dbSubscriber.email !== subscriber.fanEmail ||
        dbSubscriber.phone !== subscriber.fanPhone
    ) {
        const updatedSubscriber = {
            ...dbSubscriber,
            email: subscriber.fanEmail,
            phone: subscriber.fanPhone,
        };
        const data = addOrUpdateSubscriber(updatedSubscriber);
        if (!data) throw new DiscordError("Failed to update subscriber", false);
        return true;
    }
    return false;
};

export default (<CustomSolution>{
    id: "gangstaPhilosophy",
    router,
    config: {
        isEmailVerificationEnabled: true,
        isPhoneVerificationEnabled: true,
        isDiscordOauthEnabled: false,
    },
    subscriberValidator,
});
