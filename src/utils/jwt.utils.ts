import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export interface JWTObject {
    id: string;
    discordId: string;
    accessToken: string;
    phone?: string;
    email: string;
}

/**
 * @param object payload to be signed
 * @param expiresIn time until the token expires
 * @returns a signed JWT token
 * @description Signs a JWT token with the given payload and expiration time using the JWT_SECRET config variable.
 */
export const signJWT = (object: JWTObject, expiresIn: string) => {
    return jwt.sign(object, JWT_SECRET, { expiresIn });
};

/**
 * @param token JWT token to be verified
 * @returns the decoded token
 * @description Verifies the given JWT token using the JWT_SECRET config variable.
 */
export const verifyJWT = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as JWTObject;
};
