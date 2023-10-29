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
	verifyBotInGuildController,
} from "./controllers/service.controller";

import {
	sendOtpValidator,
	callbackValidator,
	verifyOtpValidator,
} from "./inputValidators/auth.validators";

import { generateOrVerifyBotInviteLinkValidator } from "./inputValidators/service.validators";
import { validateRequest } from "zod-express-middleware";

import {
	getInternalSheetController,
	getSheetHeadersController,
} from "./controllers/sheet.controller";
import {
	getInternalSheetValidator,
	getSheetHeadersValidator,
} from "./inputValidators/sheet.validators";

import authMiddleware from "./middlewares/auth.middleware";

const router = Router();

router.get("/login", loginController); //will remove

router.get("get-oauth-link", getOauthController); //will be used instead of login

router.get("/callback", validateRequest(callbackValidator), callbackController);

router.get("/services", authMiddleware, getServicesController);

router.get("/guilds", authMiddleware, getGuildsOfUserController);

router.get(
	"/generate-bot-invite-link",
	validateRequest(generateOrVerifyBotInviteLinkValidator),
	authMiddleware,
	generateBotInviteLinkController,
);

router.get(
	"/verify-bot-in-guild",
	validateRequest(generateOrVerifyBotInviteLinkValidator),
	authMiddleware,
	verifyBotInGuildController,
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

router.get(
	"/internal-sheet",
	authMiddleware,
	validateRequest(getInternalSheetValidator),
	getInternalSheetController,
);

router.get(
	"/sheet-headers",
	authMiddleware,
	validateRequest(getSheetHeadersValidator),
	getSheetHeadersController,
);
export default router;
