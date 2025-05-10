import { z } from "zod";

export const CreateTimeRequestSchema = z.object({
    day_of_week: z.enum(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
    start_time: z.string(),
    end_time: z.string()
})

