import { z } from "zod";

export const guildIdValidator = {
	query: z.object({
		guildId: z.string().regex(/^\d+$/).min(15).max(20),
	}),
};
