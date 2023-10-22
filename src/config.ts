import * as dotenv from 'dotenv';
dotenv.config();

function config() {
    const loadedConfig = {
        token: process.env["TOKEN"] || '',
        oAuthURL: process.env["OAUTH_URL"] || '',
        redirectURI: process.env["REDIRECT_URI"] || '',
        mongoURI: process.env["MONGO_URI"] || '',
        port: process.env["PORT"] || 5000,
        clientId: process.env["CLIENT_ID"] || '',
        clientSecret: process.env["CLIENT_SECRET"] || '',
        awsRegion: process.env["AWS_REGION"] || 'ap-south-1',
        awsAccessKeyId: process.env["AWS_ACCESS_KEY_ID"] || '',
        awsSecretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"] || '',
        emailFrom: process.env["EMAIL_FROM"] || 'no-reply@discordbot.tech',
        secretPablySource: process.env["SECRET_PABLY_SOURCE"] || '',
    }

    for (const key in loadedConfig) {
        if (!loadedConfig[key as keyof typeof loadedConfig]) {
            throw new Error(`Missing environment variable ${key}.Pleae add the variable to the .env file.`);
        }
    }
    return loadedConfig;

}

export default config();