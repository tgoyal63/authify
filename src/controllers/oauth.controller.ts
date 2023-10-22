import { Request, Response } from "express";
import DiscordOauth2 from "discord-oauth2";
import { CLIENT_ID, CLIENT_SECRET, DYNAMIC_REDIRECT_URI } from "../config";

const oauth = new DiscordOauth2({
	clientId: CLIENT_ID,
	clientSecret: CLIENT_SECRET,
	redirectUri: await DYNAMIC_REDIRECT_URI(),
});

export const oauthCallbackController = async (req: Request, res: Response) => {
	try {
		if (!req.query["code"]) throw new Error("NoCodeProvided");
		const token = await oauth.tokenRequest({
			code: req.query["code"] as string,
			scope: ["identify", "email", "guilds.join"],
			grantType: "authorization_code",
		});
		const user = await oauth.getUser(token.access_token);
		res.send(user);
	} catch (error) {
		if(error instanceof Error)
			res.status(500).send(error.message);
		else
			res.status(500).send("An unknown error occurred.");
	}
};

export const loginController = async (req: Request, res: Response) => {
	const x = oauth.generateAuthUrl({
		scope: ["identify", "email", "guilds.join"],
		state: "state",
		permissions: 8,
	});
	res.redirect(x);
};
