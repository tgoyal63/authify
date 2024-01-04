import { getSubscribers } from "../customIntegrations/tagMango/apiWrapper";
import router from "../customIntegrations/tagMango/routes";
import { CustomSolution } from "../types";
import { getMangoDetails } from "../customIntegrations/tagMango/services/tmMapper.service";
import {
    addOrUpdateSubscriber,
    getSubscriber,
} from "../customIntegrations/tagMango/services/attackMode.service";

router.get("/", async (req, res) => {
    res.send("Welcome to Gangsta Philosophy!");
});

const subscriberValidator = async (mangoes: string, term: string | number) => {
    const mangoData = await getMangoDetails(mangoes);
    if (!mangoData) throw new Error("Mango not found");
    const { customer } = mangoData;

    // Fetching from tagMango
    let subscriber = await getSubscribers({
        type: "active",
        term,
        mangoes,
        customerId: customer,
    });

    // check if subscriber is an array of length 1
    if (subscriber.length !== 1)
        throw new Error(
            "Multiple subscribers found on gangstaPhilosophy for this course!",
        );

    subscriber = subscriber[0];

    // Fetching from attackmode db
    const dbSubscriber = await getSubscriber(subscriber._id);

    // if dbSubscriber doesn't exist, add it and return true
    if (!dbSubscriber) {
        const newSubscriber = {
            tmId: subscriber._id,
            email: subscriber.fanEmail,
            phone: subscriber.fanPhone,
            name: subscriber.fanName,
            country: subscriber.fanCountry,
        };
        const data = addOrUpdateSubscriber(newSubscriber);
        if (!data) throw new Error("Failed to add subscriber!");
        return true;
    }

    // check if dbSubscriber has discordId and if it has return false
    if (dbSubscriber.discordId)
        throw new Error("Subscriber already linked to Discord!");

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
        if (!data) throw new Error("Failed to update subscriber");
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
