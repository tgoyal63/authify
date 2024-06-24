import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import gangstaPhilosophy from "./gangstaPhilosophy";
const router = Router();

router.use(
  `/${gangstaPhilosophy.id}`,
  authMiddleware,
  gangstaPhilosophy.router
);

export default router;
