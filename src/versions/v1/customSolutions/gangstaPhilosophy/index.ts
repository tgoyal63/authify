import router from "../customIntegrations/tagMango/routes";
import { CustomSolution } from "../types";

router.get("/", async (req, res) => {
    res.send("Welcome to Gangsta Philosophy!");
});

/**
Shwetabh Gangwar
Already Done:
- OTP send utility -> Phone
- Dashboard
- 
To be Done:
- Onboarding of Subscribers:
	- Understand TagMango API
- Understand Refresh-Access token
- Understand user(subscriber) validation
(Enter your creator/customer phone number on TagMango -> Internal API hit to TagMango -> Validate: -> OTP from TagMango -> input to Authify Using OTP get refresh-access token for future validations
If in any future validations, refresh-token expires -> notify creator using email for service-down -> status: inactive, reason: listed)
Add the user/subscriber to the db while validating
Subscriber: Email, Phone, DiscordId, Onboarded, TmData
Function for validation: User Email -> Fetch Data -> Check Status=active, Store relevant data to DB -> Return bool for validation
- Enhancements in Dashboard:
- Looks and Vibes of the Card (Frontend)
- User Management through Dashboard
*/

const subscriberValidator = (term: string | number) => {
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
});
