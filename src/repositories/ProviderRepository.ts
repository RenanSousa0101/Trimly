import { Provider } from "../generated/prisma"
import { PrismaClientOrTransaction } from "./ClientTransaction"

export interface ProviderWhereParams {
        business_name?: {
        contains?: string
        equals?: string
        mode?: "default" | "insensitive"
    }
}

export interface FindProviderParams {
    where?: ProviderWhereParams
    sortBy?: "business_name"
    order?: "asc" | "desc"
    skip?: number
    take?: number
}

export interface CreateProviderAttributes {
    business_name: string
    cnpj?: string
    cpf?: string
    description?: string
    logo_url?: string
    banner_url?: string
}
export interface FullProviderAttributes {
    business_name: string
    cnpj?: string | null
    cpf?: string | null
    description?: string
    logo_url?: string
    banner_url?: string
    phone_number: string
    street: string
    number: string
    cep_street: string
    complement?: string | null
    district: {
        name: string
        city: {
            name: string
            state: {
                name: string
                uf: string
                country: {
                    name: string
                    acronym: string
                }
            }
        }
    }
}

export interface IproviderRepository {
    findProvider: (params: FindProviderParams, client?: PrismaClientOrTransaction) => Promise<Provider[]>
    createProvider: (userId: number, attributes: CreateProviderAttributes, client?: PrismaClientOrTransaction) => Promise<Provider>
    countProvider: (where: ProviderWhereParams, client?: PrismaClientOrTransaction) => Promise<number>;
}