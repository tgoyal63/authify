import DiscordOauth2 from "discord-oauth2";
const { DiscordHTTPError } = DiscordOauth2;
import { CLIENT_ID, CLIENT_SECRET, DYNAMIC_REDIRECT_URI } from "../config";

const oauth = new DiscordOauth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: await DYNAMIC_REDIRECT_URI(),
});

/**
 * Gets the access token and refresh token from the Discord API
 * @param code The code received from the Discord OAuth2 callback
 * @returns An object containing the access token, refresh token, and other details
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
 * Gets the user details from the Discord API
 * @param token The Discord access token
 * @returns An object containing the user details
 * @description Gets the user details from the Discord API using the access token received from the Discord OAuth2.
 * @throws Error if the token is invalid
 */
export const getDiscordUser = async (token: string) => {
  try {
    const user = await oauth.getUser(token);
    return user;
  } catch (error) {
    if (error instanceof DiscordHTTPError) {
      throw new Error("Invalid Discord Token");
    }
    throw error;
  }
};

/**
 * Generates the OAuth2 URL for user authorization
 * @param state The state parameter for the OAuth2 flow
 * @returns The generated OAuth2 URL
 */
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

/**
 * Generates the bot invite link for a specific guild
 * @param guildId The ID of the guild to invite the bot to
 * @returns The generated bot invite link
 */
export const generateBotInviteLink = (guildId: string) => {
  const url = oauth.generateAuthUrl({
    scope: ["bot", "applications.commands"],
    guildId,
    disableGuildSelect: true,
    state: "bot",
    permissions: "8",
  });
  return url;
};

/**
 * Gets the guilds the user is a part of from the Discord API
 * @param token The Discord access token
 * @returns An array of guilds the user is a part of
 * @description Gets the guilds the user is a part of from the Discord API using the access token received from the Discord OAuth2.
 */
export const getGuilds = async (token: string) => {
  const guilds = await oauth.getUserGuilds(token);
  return guilds;
};
