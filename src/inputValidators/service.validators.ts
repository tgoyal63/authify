import { z } from "zod";

// export const sendOtpValidator = {
// 	body: z.object({
// 		phone: z.coerce.number().int().min(1000000000).max(9999999999),
// 	}),
// };

export const generateBotInviteLinkValidator = {
	query: z.object({
		guildId: z.string(),
	}),
};
