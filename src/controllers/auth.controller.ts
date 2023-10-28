import { Request, Response } from "express";
import { TypedRequestBody, TypedRequestQuery } from "zod-express-middleware";
import {
	sendOtpValidator,
	callbackValidator,
	verifyOtpValidator,
} from "../inputValidators/auth.validators";
import { generateOtp, generateOtpHash, sendOtp } from "../utils/otp.utils";

import {
	getCustomerByDiscordId,
	createCustomer,
	renewCredentials,
	updatePhone,
} from "../services/customer.service";

import { signJWT } from "../utils/jwt.utils";

import {
	getTokens,
	getDiscordUser,
	generateOauthUrl,
} from "../utils/oauth.utils";

import { FRONTEND_CLIENT_URL } from "../config";

export const callbackController = async (
	req: TypedRequestQuery<typeof callbackValidator.query>,
	res: Response,
) => {
	try {
		if (req.query.state === "bot")
			return res.redirect(
				`${FRONTEND_CLIENT_URL}/messages/success-message-bot`,
			);
		if (!req.query.code) throw new Error("NoCodeProvided");
		const token = await getTokens(req.query.code);
		const user = await getDiscordUser(token.access_token);
		const customer = await getCustomerByDiscordId(user.id);
		if (!customer) {
			if (!user.verified || !user.email)
				throw new Error("EmailNotVerified");
			const createdCustomer = await createCustomer(
				user.id,
				user.username,
				user.email as string,
				token.refresh_token,
				token.access_token,
				token.expires_in,
				token.scope,
			);
			const jwt = signJWT(
				{
					id: createdCustomer._id,
					discordId: user.id,
					accessToken: token.access_token,
					email: user.email as string,
				},
				`${token.expires_in}s`,
			);

			const params = new URLSearchParams({
				token: jwt,
				phone: "",
				type: "signup",
			});

			return res.redirect(
				`${FRONTEND_CLIENT_URL}/auth/callback-url?${params.toString()}`,
			);
		}
		await renewCredentials(
			user.id,
			token.refresh_token,
			token.access_token,
			token.expires_in,
			token.scope,
		);
		const jwt = signJWT(
			{
				id: customer._id,
				discordId: user.id,
				accessToken: token.access_token,
				phone: String(customer.phone),
				email: customer.email,
			},
			"14d",
		);
		const params = new URLSearchParams({
			token: jwt,
			phone: "",
			type: "signup",
		});
		console.log(params.toString());
		return res.redirect(
			`${FRONTEND_CLIENT_URL}/auth/callback-url?${params.toString()}`,
		);
	} catch (error: any) {
		const params = new URLSearchParams({
			error: error.message,
			type: "signup",
		});
		return res.redirect(
			`${FRONTEND_CLIENT_URL}/auth/callback-url?${params.toString()}`,
		);
	}
};

export const loginController = async (req: Request, res: Response) => {
	const oauthLink = generateOauthUrl("state");
	res.redirect(oauthLink);
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
			data: {
				phone: req.body.phone,
				expiresAt,
				otpHash,
			},
			message: "OTP sent successfully",
			success: true,
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
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
		await updatePhone(req.customer.id, req.body.phone);
		const newJWT = signJWT(
			{
				id: req.customer.id,
				discordId: req.customer.discordId,
				accessToken: req.customer.accessToken,
				phone: String(req.body.phone),
				email: req.customer.email,
			},
			"14d",
		);

		res.send({
			message: "OTP verified successfully",
			success: true,
			data: { token: newJWT },
		});
	} catch (error: any) {
		if (error instanceof Error && error.message === "Invalid OTP") {
			res.status(400).send({ message: error.message, success: false });
		}
		res.status(500).send({ message: error.message, success: false });
	}
};

export const getOauthController = async (req: Request, res: Response) => {
	try {
		const oauthLink = generateOauthUrl("state");
		res.send({
			data: { oauthLink },
			success: true,
			message: "Oauth link generated successfully",
		});
	} catch (error: any) {
		res.status(500).send({ message: error.message, success: false });
	}
};
