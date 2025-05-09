import { z } from "zod";

export const CreateSpecializationRequestSchema = z.object({
    name: z.string(),
    description: z.string().optional()
})