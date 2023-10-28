import DiscordOauth2 from "discord-oauth2";
import { CLIENT_ID, CLIENT_SECRET, DYNAMIC_REDIRECT_URI } from "../config";

const oauth = new DiscordOauth2({
	clientId: CLIENT_ID,
	clientSecret: CLIENT_SECRET,
	redirectUri: await DYNAMIC_REDIRECT_URI(),
});

/**
 *
 * @param code the code received from the Discord OAuth2 callback
 * @returns an object containing the access token, refresh token, and other details
 * @description Gets the access token and refresh token from the Discord API using the code received from the Discord OAuth2 callback.
 */
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

/**
 *
 * @param token the Discord access token
 * @returns an object containing the user details
 * @description Gets the user details from the Discord API using the access token received from the Discord OAuth2.
 * @throws Error if the token is invalid
 */
export const getDiscordUser = async (token: string) => {
	try {
		const user = await oauth.getUser(token);
		return user;
	} catch (e) {
		throw new Error("Invalid Discord Token");
	}
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

export const generateBotInviteLink = (guildId: string) => {
	const url = oauth.generateAuthUrl({
		scope: ["bot", "applications.commands"],
		guildId,
		disableGuildSelect: true,
		state: "bot",
		redirectUri: "https://www.google.com/search?q=bot+added+successfully",
	});
	return url;
};

/**
 *
 * @param token the Discord access token
 * @returns an array of guilds the user is a part of
 * @description Gets the guilds the user is a part of from the Discord API using the access token received from the Discord OAuth2.
 */
export const getGuilds = async (token: string) => {
	const guilds = await oauth.getUserGuilds(token);
	return guilds;
};
