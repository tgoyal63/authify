import jwt from "jsonwebtoken";

export const signJWT = (object: any, expiresIn: string) => {
	return jwt.sign(object, "asdasd", { expiresIn });
};