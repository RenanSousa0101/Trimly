import { z } from "zod";

export const CreateServiceCategoryRequestSchema = z.object({
    name: z.string(),
    description: z.string()
})

export const UpdateServiceCategoryRequestSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional()
})
