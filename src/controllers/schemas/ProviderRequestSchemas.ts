import { z } from "zod";
import { cpf, cnpj } from 'cpf-cnpj-validator';

export const CreateProviderRequestSchema = z.object({
    // Informações do Provedor
    business_name: z.string(),
    cnpj: z.string().min(14).max(18).nullable().optional().refine((val) => {
        if (!val) return true;
        return cnpj.isValid(val);
    }, { message: "CNPJ inválido. Verifique o número." }),
    cpf: z.string().min(11).max(14).nullable().optional().refine((val) => {
       if (!val) return true;
       return cpf.isValid(val);
   }, { message: "CPF inválido. Verifique o número." }),
    description: z.string().optional(),
    logo_url: z.string().optional(),
    banner_url: z.string().optional(),

    // Número de telefone do Provedor 
    phone_number: z.string().min(10).max(15),

    // Endereço do Provedor
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
}).superRefine((data, ctx) => {
    if (!data.cnpj && !data.cpf) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'É necessário informar pelo menos um entre CPF e CNPJ.', 
            path: [],
        });
    }
});