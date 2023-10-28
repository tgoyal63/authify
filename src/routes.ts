import { Router } from "express";
import {
	callbackController,
	loginController,
	sendOtpController,
	verifyOtpController,
	getOauthController,
} from "./controllers/auth.controller";

import {
	getServicesController,
	getGuildsOfUserController,
	generateBotInviteLinkController,
} from "./controllers/service.controller";

import {
	sendOtpValidator,
	callbackValidator,
	verifyOtpValidator,
} from "./inputValidators/auth.validators";

import { generateBotInviteLinkValidator } from "./inputValidators/service.validators";
import { validateRequest } from "zod-express-middleware";

import authMiddleware from "./middlewares/auth.middleware";

const router = Router();

router.get("/login", loginController); //will remove

router.get("get-oauth-link", getOauthController); //will be used instead of login

router.get("/callback", validateRequest(callbackValidator), callbackController);

router.get("/services", authMiddleware, getServicesController);

router.get("/guilds", authMiddleware, getGuildsOfUserController);

router.get(
	"/generate-bot-invite-link",
	validateRequest(generateBotInviteLinkValidator),
	authMiddleware,
	generateBotInviteLinkController,
);

router.post(
	"/send-otp",
	authMiddleware,
	validateRequest(sendOtpValidator),
	sendOtpController,
);
router.post(
	"/verify-otp",
	authMiddleware,
	validateRequest(verifyOtpValidator),
	verifyOtpController,
);

export default router;
