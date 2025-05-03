import { z } from 'zod';

export const GetEmail = z.object({
    email: z.string().email().toLowerCase(), 
})