import { getSubscribers } from "../customIntegrations/tagMango/apiWrapper";
import router from "../customIntegrations/tagMango/routes";
import { CustomSolution } from "../types";
import { getMangoDetailsFromServiceId } from "../customIntegrations/tagMango/services/tmMapper.service";
import {
    addOrUpdateSubscriber,
    getSubscriber,
} from "../customIntegrations/tagMango/services/attackMode.service";
import { DiscordError } from "@/types/error";

router.get("/", async (req, res) => {
    res.send("Welcome to Gangsta Philosophy!");
});

const subscriberValidator = async (
    serviceId: string,
    term: string | number,
    discordId: string,
) => {
    const mangoData = await getMangoDetailsFromServiceId(serviceId);
    if (!mangoData) throw new DiscordError("Mango not found", false);
    const mangoes = mangoData.mango;
    const { customer } = mangoData;

    // Fetching from tagMango
    let subscriber = await getSubscribers({
        type: "active",
        term,
        mangoes,
        customerId: customer,
    });

    // if subscriber doesn't exist, return false
    if (subscriber.subscribers.length === 0) return false;

    // check if subscriber is an array of length 1
    if (subscriber.subscribers.length > 1)
        throw new DiscordError(
            "Multiple subscribers found, for the same mango and term!",
            false,
        );

    subscriber = subscriber.subscribers[0];

    // Fetching from attackmode db
    const dbSubscriber = await getSubscriber(subscriber.fanId);

    // if dbSubscriber doesn't exist, add it and return tagMango subscriber id
    if (!dbSubscriber) {
        const newSubscriber = {
            tmId: subscriber.fanId,
            email: subscriber.fanEmail,
            phone: subscriber.fanPhone,
            name: subscriber.fanName,
            country: subscriber.fanCountry,
        };
        const data = await addOrUpdateSubscriber(newSubscriber);
        if (!data) throw new DiscordError("Failed to add subscriber!", false);
        return subscriber.fanId;
    }
    
    // if dbSubscriber has different phone number and email, update it and return tagMango subscriber id
    if (
        dbSubscriber.email !== subscriber.fanEmail ||
        dbSubscriber.phone !== subscriber.fanPhone ||
        dbSubscriber.country !== subscriber.fanCountry
    ) {
        const updatedSubscriber = {
            ...dbSubscriber,
            email: subscriber.fanEmail,
            phone: subscriber.fanPhone,
            country: subscriber.fanCountry,
        };
        const data = await addOrUpdateSubscriber(updatedSubscriber);
        if (!data) throw new DiscordError("Failed to update subscriber", false);
        return subscriber.fanId;
    }

    // check if dbSubscriber has same phone number and email, return tagMango subscriber id
    if (
        dbSubscriber.email === subscriber.fanEmail &&
        dbSubscriber.phone === subscriber.fanPhone &&
        dbSubscriber.country === subscriber.fanCountry
    )
        return subscriber.fanId;

    // check if dbSubscriber has discordId and if it has return false
    if (dbSubscriber.discordId && dbSubscriber.discordId !== discordId)
        throw new DiscordError(
            "Subscriber already linked to another Discord Account!",
            true,
        );

    return false;
};

const linkDiscord = async (fanId: string, discordId: string) => {
    const dbSubscriber = await getSubscriber(fanId);
    if (!dbSubscriber) {
        throw new DiscordError(
            "Subscriber not found, please validate subscriber first!",
            false,
        );
    }
    const updateSubscriber = {
        tmId: dbSubscriber.tmId,
        discordId,
        discordLinkTimestamp: new Date(),
        linkedDiscord: true,
    };
    const data = await addOrUpdateSubscriber(updateSubscriber);
    if (!data)
        throw new DiscordError(
            "Failed to update subscriber with discord id!",
            false,
        );
    return true;
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
    linkDiscord,
});
