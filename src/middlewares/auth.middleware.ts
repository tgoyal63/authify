import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt.utils";
import { getDiscordUser } from "../utils/oauth.utils";
import { User } from "../types/common";

export default async function (
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			throw new Error("Authorization header not found");
		}

		const token = authHeader.split(" ")[1]; // Assuming a header like "Bearer <token>"
		if (!token) {
			throw new Error("Token not found in Authorization header");
		}

		const userData = verifyJWT(token);
		if (!userData) {
			throw new Error("Invalid token");
		}

		const customer = {
			id: userData.id,
			discordId: userData.discordId,
			accessToken: userData.accessToken,
			phone: userData.phone,
			email: userData.email,
			getDiscordUser: async () => {
				return await getDiscordUser(userData.accessToken);
			},
		} as User;

		req.customer = customer;

		next();
	} catch (error: any) {
		res.status(401).json({ message: error.message });
	}
}
