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
 * Signs a JWT token with the given payload and expiration time
 * @param object Payload to be signed
 * @param expiresIn Expiration time for the token
 * @returns A signed JWT token
 */
export const signJWT = (object: JWTObject, expiresIn: string) => {
  return jwt.sign(object, JWT_SECRET, { expiresIn });
};

/**
 * Verifies the given JWT token
 * @param token JWT token to be verified
 * @returns The decoded token
 */
export const verifyJWT = (token: string): JWTObject => {
  return jwt.verify(token, JWT_SECRET) as JWTObject;
};
