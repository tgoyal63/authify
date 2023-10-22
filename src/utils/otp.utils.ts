import crypto from "crypto";
import axios, { AxiosRequestConfig } from "axios";
import { Fast2SMS_API_KEY, OTP_SECRET } from "../config";

export const generateOtp = () => {
	const otp = crypto.randomInt(100000, 999999);
	return otp;
};

export const generateOtpHash = (
	phone: number,
	otp: number,
	expiresAt: number,
) => {
	const otpHash = crypto
		.createHmac("sha256", OTP_SECRET)
		.update(`${phone}-${otp}-${expiresAt}`)
		.digest("hex");
	return otpHash;
};

export const sendOtp = async (phone: number, otp: unknown): Promise<void> => {
	try {
		const response = await axios.get(
			"https://www.fast2sms.com/dev/bulkV2",
			{
				params: {
					authorization: Fast2SMS_API_KEY,
					route: "otp",
					numbers: phone,
					variables_values: otp,
					flash: "0",
				},
			},
		);
		if (response.data.return === false)
			throw new Error(response.data.message[0] || "Fast2SMS API error.");
	} catch (error: any) {
		console.log(error.message);
		throw new Error("Fast2SMS API error.");
	}
};
