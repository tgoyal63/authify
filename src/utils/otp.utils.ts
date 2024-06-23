import crypto from "crypto";
import axios from "axios";
import { Collection } from "discord.js";
import { Fast2SMS_API_KEY, OTP_EXPIRY_TIME, OTP_SECRET } from "../config";

interface OtpData {
  otp: number;
  userId?: string;
}

const otpCollection = new Collection<string, OtpData>();

/**
 * Generates a 6 digit OTP
 * @returns a 6 digit OTP
 */
export const generateOtp = (): number => {
  const otp = crypto.randomInt(100000, 999999);
  return otp;
};

/**
 * Generates an OTP for a given Discord ID and stores it
 * @param discordId The Discord ID
 * @param userId Optional user ID
 * @returns The generated OTP
 */
export const generateOtpForDiscordId = (
  discordId: string,
  userId?: string
): number => {
  const existing = otpCollection.get(discordId);
  if (existing) return existing.otp;
  const otp = generateOtp();
  otpCollection.set(discordId, { otp, userId } as OtpData);
  setTimeout(() => {
    otpCollection.delete(discordId);
  }, OTP_EXPIRY_TIME);
  return otp;
};

/**
 * Verifies the OTP for a given Discord ID
 * @param discordId The Discord ID
 * @param otp The OTP to verify
 * @returns The existing OTP data if the OTP is correct, otherwise undefined
 */
export const verifyOtpForDiscordId = (
  discordId: string,
  otp: number
): OtpData | undefined => {
  const existing = otpCollection.get(discordId);
  if (existing?.otp === otp) {
    otpCollection.delete(discordId);
    return existing;
  }
  return undefined;
};

/**
 * Generates a hash of the OTP
 * @param phone The phone number to generate the OTP hash for
 * @param otp The OTP to generate the OTP hash for
 * @param expiresAt The time the OTP expires
 * @returns The hash of the OTP
 */
export const generateOtpHash = (
  phone: number,
  otp: number,
  expiresAt: number
): string => {
  const otpHash = crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${phone}-${otp}-${expiresAt}`)
    .digest("hex");
  return otpHash;
};

/**
 * Sends the OTP to the given phone number using the Fast2SMS API
 * @param phone The phone number to send the OTP to
 * @param otp The OTP to send
 * @returns void
 * @throws {Error}
 */
export const sendOtp = async (phone: number, otp: number): Promise<void> => {
  try {
    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: Fast2SMS_API_KEY,
        route: "otp",
        numbers: phone,
        variables_values: otp,
        flash: "0",
      },
    });
    if (response.data.return === false) {
      throw new Error(response.data.message[0] || "Fast2SMS API error.");
    }
  } catch (error: any) {
    console.error("Fast2SMS API error:", error);
    throw new Error("Fast2SMS API error.");
  }
};
