import { Request, Response } from "express";
import DiscordOauth2 from "discord-oauth2";
import { CLIENT_ID, CLIENT_SECRET, DYNAMIC_REDIRECT_URI } from "../config";
import { TypedRequestBody, TypedRequestQuery } from "zod-express-middleware";
import {
	sendOtpValidator,
	callbackValidator,
	verifyOtpValidator,
} from "@/inputValidators";
import { generateOtp, generateOtpHash, sendOtp } from "../utils/otp.utils";

const oauth = new DiscordOauth2({
	clientId: CLIENT_ID,
	clientSecret: CLIENT_SECRET,
	redirectUri: await DYNAMIC_REDIRECT_URI(),
});

export const callbackController = async (
	req: TypedRequestQuery<typeof callbackValidator.query>,
	res: Response,
) => {
	try {
		if (!req.query.code) throw new Error("NoCodeProvided");
		const token = await oauth.tokenRequest({
			code: req.query.code,
			scope: [
				"identify",
				"email",
				"guilds",
				"guilds.members.read",
				"guilds.join",
			],
			grantType: "authorization_code",
		});
		console.log(token);
		const user = await oauth.getUser(token.access_token);
	} catch (error: any) {
		res.status(500).send(error.message);
	}
};

export const loginController = async (req: Request, res: Response) => {
	const x = oauth.generateAuthUrl({
		scope: [
			"identify",
			"email",
			"guilds",
			"guilds.members.read",
			"guilds.join",
		],
		state: "state",
	});
	res.redirect(x);
};

export const sendOtpController = async (
	req: TypedRequestBody<typeof sendOtpValidator.body>,
	res: Response,
) => {
	try {
		const otp = generateOtp();
		const expiresAt = Date.now() + 1000 * 60 * 5;
		const otpHash = generateOtpHash(req.body.phone, otp, expiresAt);
		await sendOtp(req.body.phone, otp);
		res.send({
			phone: req.body.phone,
			expiresAt,
			otpHash,
			message: "OTP sent successfully",
			success: true,
		});
	} catch (error: any) {
		res.status(500).send(error.message);
	}
};

export const verifyOtpController = async (
	req: TypedRequestBody<typeof verifyOtpValidator.body>,
	res: Response,
) => {
	try {
		const otpHash = generateOtpHash(
			req.body.phone,
			req.body.otp,
			req.body.expiresAt,
		);
		if (otpHash !== req.body.otpHash) throw new Error("Invalid OTP");
		res.send({ message: "OTP verified successfully", success: true });
	} catch (error: any) {
		res.status(500).send(error.message);
	}
};
