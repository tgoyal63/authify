import { User as DiscordUser } from "discord-oauth2";

export interface Customer {
    id: string;
    discordId: string;
    accessToken: string;
    phone?: string | undefined;
    email: string;
    getDiscordUser: () => Promise<DiscordUser>;
}
