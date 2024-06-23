import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt.utils";
import { getDiscordUser } from "../utils/oauth.utils";
import { Customer } from "@/types/common";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "Authorization header not found" });
      return;
    }

    const token = authHeader.split(" ")[1]; // Assuming a header like "Bearer <token>"
    if (!token) {
      res
        .status(401)
        .json({ message: "Token not found in Authorization header" });
      return;
    }

    const userData = verifyJWT(token);
    if (!userData) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const customer: Customer = {
      id: userData.id,
      discordId: userData.discordId,
      accessToken: userData.accessToken,
      phone: userData.phone,
      email: userData.email,
      getDiscordUser: async () => {
        return await getDiscordUser(userData.accessToken);
      },
    };

    req.customer = customer;
    next();
  } catch (error: any) {
    res.status(401).json({ message: error.message });
    return;
  }
}
