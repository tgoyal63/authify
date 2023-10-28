import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

/**
 * @param object payload to be signed
 * @param expiresIn time until the token expires
 * @returns a signed JWT token
 * @description Signs a JWT token with the given payload and expiration time using the JWT_SECRET config variable.
 */
export const signJWT = (object: any, expiresIn: string) => {
	return jwt.sign(object, JWT_SECRET, { expiresIn });
};
