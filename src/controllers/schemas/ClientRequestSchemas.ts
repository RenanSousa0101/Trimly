import { z } from "zod";
import { cpf } from 'cpf-cnpj-validator';

export const GetClientRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    cpf: z.string().min(11).max(14).nullable().optional().refine((val) => {
        if (!val) return true;
        return cpf.isValid(val);
    }, { message: "CPF inválido. Verifique o número." }),
    sortBy: z.enum(['cpf']).optional(),
    order: z.enum(['asc', 'desc']).optional()
})

export const CreateClientRequestSchema = z.object({
    // Informações do Client
    cpf: z.string().min(11).max(14).refine((val) => {
        if (!val) return true;
        return cpf.isValid(val);
    }, { message: "CPF inválido. Verifique o número." }),
    communication_preference: z.string().optional(),
    // Número de telefone do Client 
    phone_number: z.string().min(10).max(25),

    // Endereço do Client
    street: z.string().min(1),
    number: z.string().min(1),
    cep_street: z.string().min(1),
    complement: z.string().optional(),
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

export const UpdateClientRequestSchema = z.object({
    // Informações do Client
    cpf: z.string().min(11).max(14).optional().refine((val) => {
        if (!val) return true;
        return cpf.isValid(val);
    }, { message: "CPF inválido. Verifique o número." }),
    communication_preference: z.string().optional(),
    // Número de telefone do Client 
    phone_number: z.string().min(10).max(25).optional(),

    // Endereço do Client
    street: z.string().min(1).optional(),
    number: z.string().min(1).optional(),
    cep_street: z.string().min(1).optional(),
    complement: z.string().optional(),
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
    }).optional(),
})