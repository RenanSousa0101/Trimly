import { z } from "zod";

export const CreateServiceCategoryRequestSchema = z.object({
    name: z.string(),
    description: z.string()
})

export const UpdateServiceCategoryRequestSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional()
})

export const CreateServiceRequestSchema = z.object({
    name: z.string(),
    description: z.string(),
    serviceCategoryName: z.string()
})

export const UpdateServiceRequestSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    serviceCategoryName: z.string().optional()
})

export const CreateProviderServiceRequestSchema = z.object({
    price: z.number()
    .min(0, "O valor não pode ser negativo.")
    .refine((val) => {
      const decimalPlaces = String(val).split('.')[1]?.length || 0;
      return decimalPlaces <= 2;
    }, "O valor deve ter no máximo 2 casas decimais."),
    duration: z.number().gt(0),
    nameService: z.string()
})

export const UpdateProviderServiceRequestSchema = z.object({
    price: z.number()
    .min(0, "O valor não pode ser negativo.")
    .refine((val) => {
      const decimalPlaces = String(val).split('.')[1]?.length || 0;
      return decimalPlaces <= 2;
    }, "O valor deve ter no máximo 2 casas decimais.").optional(),
    duration: z.number().gt(0).optional(),
    nameService: z.string().optional()
})