import { z } from "zod";

export const RegisterUserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(50),
})

export const LoginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50)
})