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
	createServiceController,
} from "./controllers/service.controller";

import {
	sendOtpValidator,
	verifyOtpValidator,
} from "./inputValidators/auth.validators";

import {
	createServiceValidator,
	guildIdValidator,
} from "./inputValidators/service.validators";
import { validateRequest } from "zod-express-middleware";

import {
	getInternalSheetController,
	getSheetHeadersController,
	validateSheetHeadersController,
} from "./controllers/sheet.controller";

import { getAvailableRolesController } from "./controllers/discord.controller";
import {
	getInternalSheetValidator,
	sheetHeadersValidator,
	sheetHeadersValidatorV2,
} from "./inputValidators/sheet.validators";

import authMiddleware from "./middlewares/auth.middleware";

const router = Router();

router.get("/login", loginController); //will remove

router.get("/oauth-link", getOauthController); //will be used instead of login

router.get("/callback", callbackController);

router.get("/services", authMiddleware, getServicesController);

router.get("/guilds", authMiddleware, getGuildsOfUserController);

router.get(
	"/generate-bot-invite-link",
	validateRequest(guildIdValidator),
	authMiddleware,
	generateBotInviteLinkController,
);

router.get(
	"/verify-bot-in-guild",
	validateRequest(guildIdValidator),
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
	"/internal-sheets",
	authMiddleware,
	validateRequest(getInternalSheetValidator),
	getInternalSheetController,
);

router.get(
	"/validate-sheet-headers",
	authMiddleware,
	validateRequest(sheetHeadersValidator),
	validateSheetHeadersController,
);

router.get(
	"/discord-roles",
	authMiddleware,
	validateRequest(guildIdValidator),
	getAvailableRolesController,
);

router.post(
	"/create-service",
	authMiddleware,
	validateRequest(createServiceValidator),
	createServiceController,
);

router.get(
	"/sheetHeaders",
	authMiddleware,
	validateRequest(sheetHeadersValidatorV2),
	getSheetHeadersController,
);
export default router;
