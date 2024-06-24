import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt.utils";
import { getDiscordUser } from "../utils/oauth.utils";
import { Customer } from "@/types/common";
import { ControllerError } from "@/types/error/controller-error";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ControllerError("Authorization header not found", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new ControllerError("Token not found in Authorization header", 401);
    }

    const userData = verifyJWT(token);
    if (!userData) {
      throw new ControllerError("Invalid token", 401);
    }

    const customer: Customer = {
      id: userData.id,
      discordId: userData.discordId,
      accessToken: userData.accessToken,
      phone: userData.phone,
      email: userData.email,
      getDiscordUser: async () => await getDiscordUser(userData.accessToken),
    };

    req.customer = customer;
    next();
  } catch (error: any) {
    if (error instanceof ControllerError) {
      res.status(error.code).json({ success: false, message: error.message });
    } else {
      console.error("Unexpected error in auth middleware:", error);
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  }
}
