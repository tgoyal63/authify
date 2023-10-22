import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
    token: string;
    oAuthURL: string;
    mongoURI: string;
    port: number;
    clientId: string;
    clientSecret: string;
    awsRegion: string;
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
    emailFrom: string;
}

interface DevConfig {
    ngrokDomain?: string | undefined;
    ngrokAuthToken?: string | undefined;
    redirectURI?: string | undefined;
}

let dynamicRedirectURI: string  = process.env['REDIRECT_URI'] || (process.env['NGROK_DOMAIN'] ? `https://${process.env['NGROK_DOMAIN']}/callback`: '');

const loadedConfig: Config = {
    token: process.env['TOKEN'] || '',
    oAuthURL: process.env['OAUTH_URL'] || '',
    mongoURI: process.env['MONGO_URI'] || '',
    port: parseInt(process.env['PORT'] || '5000', 10),
    clientId: process.env['CLIENT_ID'] || '',
    clientSecret: process.env['CLIENT_SECRET'] || '',
    awsRegion: process.env['AWS_REGION'] || 'ap-south-1',
    awsAccessKeyId: process.env['AWS_ACCESS_KEY_ID'] || '',
    awsSecretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] || '',
    emailFrom: process.env['EMAIL_FROM'] || 'no-reply@discordbot.tech',
};

const devConfig: DevConfig = {
    ngrokDomain: process.env['NGROK_DOMAIN'],
    ngrokAuthToken: process.env['NGROK_AUTHTOKEN'],
}

function getConfig(): Config & Partial<DevConfig> {

    for (const key in loadedConfig) {
        if (!loadedConfig[key as keyof Config]) {
            throw new Error(`Missing environment variable ${key}. Please add the variable to the .env file.`);
        }
    }
    const isDevelopment = process.env['NODE_ENV'] === 'development';
    if (isDevelopment) {
        for (const key in devConfig) {
            if (!devConfig[key as keyof DevConfig]) {
                console.warn(`Missing environment variable ${key}. Please add the variable to the .env file.`);
            }
        }
    }

    return { ...loadedConfig, ...devConfig, redirectURI: dynamicRedirectURI };
}

function setDynamicRedirectURI(uri: string) {
    dynamicRedirectURI = uri;
}

export { getConfig, setDynamicRedirectURI };
