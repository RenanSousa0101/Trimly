import { z } from "zod";

export const CreateAddressRequestSchema = z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    cep_street: z.string().min(1),
    complement: z.string().optional(),
    address_type: z.enum(["Home", "Work", "Other"]),
    district: z.object({
        name: z.string().min(1),
        city: z.object({
            name: z.string().min(1),
            state: z.object({
                name: z.string().min(1),
                uf: z.string().min(1),
                country: z.object({
                    name: z.string().min(1),
                    acronym: z.string().min(1),
                }),
            }),
        }),
    }),
})
