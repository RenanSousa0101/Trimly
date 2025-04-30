import { z } from "zod";

export const CreateRoleRequestSchema = z.object({
    role_type: z.enum(["Admin", "Provider", "Client"])
})

export const UpdateRoleRequestSchema = z.object({
    role_type: z.enum(["Admin", "Provider", "Client"]).default('Client')
})