import { Request, Response } from 'express';
import DiscordOauth2 from 'discord-oauth2'
import { CLIENT_ID, CLIENT_SECRET, DYNAMIC_REDIRECT_URI } from '../config';

let oauth: DiscordOauth2;

const initOauth = async() => {
    const redirectURI = await DYNAMIC_REDIRECT_URI();
    oauth =  new DiscordOauth2({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: redirectURI,
    });
}



export const oauthCallbackController = async (req: Request, res: Response) => {
    if(!oauth) await initOauth();

    const x = oauth.generateAuthUrl({
        scope: ["identify", "email", "guilds.join"],
        state: "state",
        permissions: 8,
    })

    try {
        if (!req.query['code']) throw new Error("NoCodeProvided");
        const token = await oauth.tokenRequest({
            code: req.query['code'] as string,
            scope: "identify email guilds.join",
            grantType: "authorization_code",
        });
        const user = await oauth.getUser(token.access_token);
        res.send(user);
        
    } catch (error) {
        console.log(error);
        res.send({error})
    }
}

export const loginController = async (req: Request, res: Response) => {
    if(!oauth) await initOauth();
    const x = oauth.generateAuthUrl({
        scope: ["identify", "email", "guilds.join"],
        state: "state",
        permissions: 8,
    });
    res.redirect(x);
}