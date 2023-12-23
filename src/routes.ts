import { Router } from "express";
import {
	callbackController,
	getOauthController,
	loginController,
	sendOtpController,
	verifyOtpController,
} from "./controllers/auth.controller";

import {
	createServiceController,
	generateBotInviteLinkController,
	getGuildsOfUserController,
	getServicesController,
	verifyBotInGuildController,
} from "./controllers/service.controller";

import {
	sendOtpValidator,
	verifyOtpValidator,
} from "./inputValidators/auth.validators";

import { validateRequest } from "zod-express-middleware";
import {
	createServiceValidator,
	guildIdValidator,
} from "./inputValidators/service.validators";

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

import customSolutionsRouter from "./customSolutions";
import authMiddleware from "./middlewares/auth.middleware";

const router = Router();

router.use("/customSolutions", customSolutionsRouter);

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
