import { z } from "zod";

export const GetTokenRequestSchema = z.object({
    token: z.string()
})