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
 * @throws {Error} If the token fails to sign
 */
export const signJWT = (object: JWTObject, expiresIn: string): string => {
  if (!expiresIn) {
    throw new Error("Expiration time is required for signing a JWT.");
  }

  try {
    return jwt.sign(object, JWT_SECRET, { expiresIn });
  } catch (error) {
    console.error("Error signing JWT:", error);
    throw new Error("Failed to sign JWT");
  }
};

/**
 * Verifies the given JWT token using the JWT_SECRET config variable.
 * @param token JWT token to be verified
 * @returns The decoded token
 * @throws {Error} If the token fails to verify
 */
export const verifyJWT = (token: string): JWTObject => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTObject;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    throw new Error("Failed to verify JWT");
  }
};
