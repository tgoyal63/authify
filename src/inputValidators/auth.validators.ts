import { z } from "zod";

export const sendOtpValidator = {
	body: z.object({
		phone: z.coerce.number().int().min(1000000000).max(9999999999),
	}),
};

export const callbackValidator = {
	query: z.object({
		code: z.string(),
		state: z.string(),
	}),
};

export const verifyOtpValidator = {
	body: z.object({
		phone: z.coerce.number().int().min(1000000000).max(9999999999),
		otp: z.coerce.number().int().min(100000).max(999999),
		otpHash: z.string(),
		expiresAt: z.coerce.number().int(),
	}),
};
