import * as dotenv from "dotenv";
dotenv.config();
import ngrok from "./utils/ngrok.util";

let ngrokURL: Promise<string>;
if(process.env["NODE_ENV"] === "development")
	ngrokURL = ngrok();
else
	ngrokURL = Promise.resolve("");

export const TOKEN: string = process.env["TOKEN"] || "";
export const OAUTH_URL: string = process.env["OAUTH_URL"] || "";
export const MONGO_URI: string = process.env["MONGO_URI"] || "";
export const PORT: number = parseInt(process.env["PORT"] || "5000", 10);
export const CLIENT_ID: string = process.env["CLIENT_ID"] || "";
export const CLIENT_SECRET: string = process.env["CLIENT_SECRET"] || "";
export const AWS_REGION: string = process.env["AWS_REGION"] || "ap-south-1";
export const AWS_ACCESS_KEY_ID: string = process.env["AWS_ACCESS_KEY_ID"] || "";
export const AWS_SECRET_ACCESS_KEY: string =
	process.env["AWS_SECRET_ACCESS_KEY"] || "";
export const EMAIL_FROM: string =
	process.env["EMAIL_FROM"] || "no-reply@discordbot.tech";
export const NGROK_DOMAIN: string | undefined = process.env["NGROK_DOMAIN"];
export const NGROK_AUTHTOKEN: string | undefined =
	process.env["NGROK_AUTHTOKEN"];
export async function DYNAMIC_REDIRECT_URI() {
	if (process.env["NODE_ENV"] === "development")
		return `${await ngrokURL}/callback`;
	else {
		if (!process.env["REDIRECT_URI"])
			throw new Error("REDIRECT_URI environment variable not found.");
		return process.env["REDIRECT_URI"] as string;
	}
}

// Validation for required variables
if (
	!TOKEN ||
	!OAUTH_URL ||
	!MONGO_URI ||
	!CLIENT_ID ||
	!CLIENT_SECRET ||
	!AWS_ACCESS_KEY_ID ||
	!AWS_SECRET_ACCESS_KEY
) {
	throw new Error(
		"One or more required environment variables are missing. Please add them to the .env file.",
	);
}

// Validation for development variables in a development environment
if (
	process.env["NODE_ENV"] === "development" &&
	(!NGROK_DOMAIN || !NGROK_AUTHTOKEN)
) {
	console.warn(
		"One or more development environment variables are missing. Please add them to the .env file.",
	);
}
