import ngrok from "./utils/ngrok.util";

let ngrokURL: Promise<string>;
if (process.env.NODE_ENV === "development") {
  ngrokURL = ngrok();
} else {
  ngrokURL = Promise.resolve("");
}

export const TOKEN: string = process.env.TOKEN || "";
export const FRONTEND_CLIENT_URL: string =
  process.env.FRONTEND_CLIENT_URL || "http://localhost:3000";
export const CORS_ORIGIN: string = process.env.CORS_ORIGIN || "*";
export const MONGO_URI: string = process.env.MONGO_URI || "";
export const PORT: number = parseInt(process.env.PORT || "5000", 10);
export const CLIENT_ID: string = process.env.CLIENT_ID || "";
export const CLIENT_SECRET: string = process.env.CLIENT_SECRET || "";
export const AWS_REGION: string = process.env.AWS_REGION || "ap-south-1";
export const AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY: string =
  process.env.AWS_SECRET_ACCESS_KEY || "";
export const EMAIL_FROM: string =
  process.env.EMAIL_FROM || "no-reply@discordbot.tech";
export const NGROK_DOMAIN: string | undefined = process.env.NGROK_DOMAIN;
export const NGROK_AUTHTOKEN: string | undefined = process.env.NGROK_AUTHTOKEN;
export const Fast2SMS_API_KEY: string = process.env.Fast2SMS_API_KEY || "";
export const OTP_SECRET: string =
  process.env.OTP_SECRET || "supersecretotpsecret";
export const JWT_SECRET: string =
  process.env.JWT_SECRET || "supersecretjwtsecret";
export const GUILD_ID: string = process.env.GUILD_ID || "1165185944534667395";
export const OTP_EXPIRY_TIME: number = parseInt(
  process.env.OTP_EXPIRY_TIME || `${5 * 60 * 1000}`,
  10
);

export async function DYNAMIC_REDIRECT_URI(): Promise<string> {
  if (process.env.NODE_ENV === "development") {
    return `${await ngrokURL}/callback`;
  }
  if (!process.env.REDIRECT_URI) {
    throw new Error("REDIRECT_URI environment variable not found.");
  }
  return process.env.REDIRECT_URI as string;
}

// Validation for required variables
const requiredVariables = [
  "TOKEN",
  "MONGO_URI",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "Fast2SMS_API_KEY",
  "OTP_SECRET",
  "FRONTEND_CLIENT_URL",
];

requiredVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(
      `Required environment variable ${variable} is missing. Please add it to the .env file.`
    );
  }
});

// Validation for development variables in a development environment
if (
  process.env.NODE_ENV === "development" &&
  (!NGROK_DOMAIN || !NGROK_AUTHTOKEN)
) {
  console.warn(
    "One or more development environment variables are missing. Please add them to the .env file."
  );
}
