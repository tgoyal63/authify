import { Router } from "express";
import gangstaPhilosophy from "./gangstaPhilosophy";
import authMiddleware from "../middlewares/auth.middleware";
const router = Router();

router.use(
	`/${gangstaPhilosophy.id}`,
	authMiddleware,
	gangstaPhilosophy.router,
);

export default router;
