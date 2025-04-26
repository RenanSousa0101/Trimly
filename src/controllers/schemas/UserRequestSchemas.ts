import { z } from 'zod';

export const GetUserRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    sortBy: z.enum(['name']).optional(),
    order: z.enum(['asc', 'desc']).optional()
})

export const CreateUserRequestSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    avatar_url: z.string().optional(),
    bio: z.string().optional(),
})

export const UpdateUserRequestSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    avatar_url: z.string().optional(),
    bio: z.string().optional(),
}).partial()
