import { z } from "zod";

export const CreatePhoneRequestSchema = z.object({
    phone_number: z.string().min(10).max(25),
    phone_type: z.enum(["Home", "Work", "Mobile", "Fax", "Other"]),
    is_primary: z.coerce.boolean().optional()
})

export const UpdatePhoneRequestSchema = z.object({
    phone_number: z.string().min(10).max(25).optional(),
    phone_type: z.enum(["Home", "Work", "Mobile", "Fax", "Other"]).optional(),
    is_primary: z.coerce.boolean().optional()
})