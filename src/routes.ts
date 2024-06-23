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
  getServiceDataController,
  createTMServiceController,
} from "./controllers/service.controller";

import {
  sendOtpValidator,
  verifyOtpValidator,
} from "./inputValidators/auth.validators";

import { validateRequest } from "zod-express-middleware";
import {
  createServiceValidator,
  createTMServiceValidator,
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

// Custom solutions routes
router.use("/customSolutions", customSolutionsRouter);

// Auth routes
router.get("/login", loginController); // To be removed
router.get("/oauth-link", getOauthController); // Use instead of login
router.get("/callback", callbackController);

// Service routes
router.get("/services", authMiddleware, getServicesController);
router.get("/service/:serviceId", authMiddleware, getServiceDataController);
router.get("/guilds", authMiddleware, getGuildsOfUserController);
router.get(
  "/generate-bot-invite-link",
  validateRequest(guildIdValidator),
  authMiddleware,
  generateBotInviteLinkController
);
router.get(
  "/verify-bot-in-guild",
  validateRequest(guildIdValidator),
  authMiddleware,
  verifyBotInGuildController
);
router.post(
  "/send-otp",
  authMiddleware,
  validateRequest(sendOtpValidator),
  sendOtpController
);
router.post(
  "/verify-otp",
  authMiddleware,
  validateRequest(verifyOtpValidator),
  verifyOtpController
);

// Sheet routes
router.get(
  "/internal-sheets",
  authMiddleware,
  validateRequest(getInternalSheetValidator),
  getInternalSheetController
);
router.get(
  "/validate-sheet-headers",
  authMiddleware,
  validateRequest(sheetHeadersValidator),
  validateSheetHeadersController
);
router.get(
  "/sheetHeaders",
  authMiddleware,
  validateRequest(sheetHeadersValidatorV2),
  getSheetHeadersController
);

// Discord routes
router.get(
  "/discord-roles",
  authMiddleware,
  validateRequest(guildIdValidator),
  getAvailableRolesController
);

// Service creation routes
router.post(
  "/create-service",
  authMiddleware,
  validateRequest(createServiceValidator),
  createServiceController
);
router.post(
  "/create-tm-service",
  authMiddleware,
  validateRequest(createTMServiceValidator),
  createTMServiceController
);

export default router;
