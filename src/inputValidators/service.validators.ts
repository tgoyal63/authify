import { z } from "zod";

// export const sendOtpValidator = {
// 	body: z.object({
// 		phone: z.coerce.number().int().min(1000000000).max(9999999999),
// 	}),
// };

export const generateOrVerifyBotInviteLinkValidator = {
	query: z.object({
		guildId: z.string().regex(/^\d+$/).min(15).max(20),
	}),
};
