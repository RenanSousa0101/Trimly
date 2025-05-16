import { z } from "zod";


export const CreateSchedulingRequestSchema = z.object({
    appointment_date: z.string(),
    notes: z.string()
})