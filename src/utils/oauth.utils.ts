import DiscordOauth2, {
  TokenRequestResult,
  User,
  PartialGuild,
} from "discord-oauth2";
import { CLIENT_ID, CLIENT_SECRET, DYNAMIC_REDIRECT_URI } from "../config";

let oauth: DiscordOauth2;

/**
 * Initializes the DiscordOauth2 instance
 */
const initializeOauth = async (): Promise<void> => {
  oauth = new DiscordOauth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: await DYNAMIC_REDIRECT_URI(),
  });
};

// Immediately invoke the initialization function
initializeOauth().catch((error) => {
  console.error("Error initializing OAuth:", error);
  throw new Error("Failed to initialize OAuth");
});

/**
 * Gets the access token and refresh token from the Discord API
 * @param code The code received from the Discord OAuth2 callback
 * @returns An object containing the access token, refresh token, and other details
 * @throws {Error} If the token request fails
 */
export const getTokens = async (code: string): Promise<TokenRequestResult> => {
  if (!code) {
    throw new Error("Code is required to get tokens.");
  }

  try {
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
  } catch (error) {
    console.error("Error getting tokens:", error);
    throw new Error("Failed to get tokens from Discord");
  }
};

/**
 * Gets the user details from the Discord API
 * @param token The Discord access token
 * @returns An object containing the user details
 * @throws {Error} If the token is invalid
 */
export const getDiscordUser = async (token: string): Promise<User> => {
  if (!token) {
    throw new Error("Token is required to get Discord user.");
  }

  try {
    return await oauth.getUser(token);
  } catch (error) {
    if (error instanceof DiscordOauth2.DiscordHTTPError) {
      throw new Error("Invalid Discord Token");
    }
    console.error("Error getting Discord user:", error);
    throw error;
  }
};

/**
 * Generates the OAuth2 URL for user authorization
 * @param state The state parameter for the OAuth2 flow
 * @returns The generated OAuth2 URL
 */
export const generateOauthUrl = (state: string): string => {
  if (!state) {
    throw new Error("State is required to generate OAuth URL.");
  }

  return oauth.generateAuthUrl({
    scope: [
      "identify",
      "email",
      "guilds",
      "guilds.members.read",
      "guilds.join",
    ],
    state,
  });
};

/**
 * Generates the bot invite link for a specific guild
 * @param guildId The ID of the guild to invite the bot to
 * @returns The generated bot invite link
 */
export const generateBotInviteLink = (guildId: string): string => {
  if (!guildId) {
    throw new Error("Guild ID is required to generate bot invite link.");
  }

  return oauth.generateAuthUrl({
    scope: ["bot", "applications.commands"],
    guildId,
    disableGuildSelect: true,
    state: "bot",
    permissions: "8",
  });
};

/**
 * Gets the guilds the user is a part of from the Discord API
 * @param token The Discord access token
 * @returns An array of guilds the user is a part of
 * @throws {Error} If fetching guilds fails
 */
export const getGuilds = async (token: string): Promise<PartialGuild[]> => {
  if (!token) {
    throw new Error("Token is required to get user guilds.");
  }

  try {
    return await oauth.getUserGuilds(token);
  } catch (error) {
    console.error("Error getting user guilds:", error);
    throw new Error("Failed to get user guilds from Discord");
  }
};
