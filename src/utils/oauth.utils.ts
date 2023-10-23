import DiscordOauth2 from "discord-oauth2";
import { CLIENT_ID, CLIENT_SECRET, DYNAMIC_REDIRECT_URI } from "../config";

const oauth = new DiscordOauth2({
	clientId: CLIENT_ID,
	clientSecret: CLIENT_SECRET,
	redirectUri: await DYNAMIC_REDIRECT_URI(),
});

export const getTokens = async (code: string) => {
	const token = await oauth.tokenRequest({
		code,
		scope: [
			"identify",
			"email",
			"guilds",
			"guilds.members.read",
			"guilds.join",
		],
		grantType: "authorization_code",
	});
	return token;
};

export const getDiscordUser = async (token: string) => {
	const user = await oauth.getUser(token);
	return user;
};

export const generateOauthUrl = (state: string) => {
	const url = oauth.generateAuthUrl({
		scope: [
			"identify",
			"email",
			"guilds",
			"guilds.members.read",
			"guilds.join",
		],
		state,
	});
	return url;
};

export const getGuilds = async (token: string) => {
	const guilds = await oauth.getUserGuilds(token);
	return guilds;
};
