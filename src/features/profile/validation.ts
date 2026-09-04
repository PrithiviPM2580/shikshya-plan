import { z } from "zod";

export const profileInput = z.object({
	name: z.string().trim().min(1).max(120),
	theme: z.enum(["SYSTEM", "LIGHT", "DARK"]),
});
