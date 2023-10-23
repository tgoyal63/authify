import { Router } from "express";
import {
	callbackController,
	loginController,
	sendOtpController,
} from "./controllers/auth.controller";
import { sendOtpValidator, callbackValidator } from "./inputValidators";
import { validateRequest } from "zod-express-middleware";

const router = Router();

router.get("/login", loginController);
router.get("/callback", validateRequest(callbackValidator), callbackController);



router.post("/send-otp", validateRequest(sendOtpValidator), sendOtpController);

export default router;
