import { Provider } from "../generated/prisma/client"
import { PrismaClientOrTransaction } from "./ClientTransaction"

export interface ProviderWhereParams {
        business_name?: {
        contains?: string
        equals?: string
        mode?: "default" | "insensitive"
    },
    cpf?: string,
    cnpj?: string
}

export interface FindProviderParams {
    where?: ProviderWhereParams
    sortBy?: "business_name" | "cpf" | "cnpj"
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
    findProviders: (params: FindProviderParams, client?: PrismaClientOrTransaction) => Promise<Provider[]>
    findByIdProvider: (userId: number, providerId: number, client?: PrismaClientOrTransaction) => Promise<Provider | null>
    createProvider: (userId: number, addressId: number, phoneId: number, attributes: CreateProviderAttributes, client?: PrismaClientOrTransaction) => Promise<Provider>
    countProvider: (where: ProviderWhereParams, client?: PrismaClientOrTransaction) => Promise<number>;
    updateProvider: (userId: number, providerId: number, attributes: Partial<CreateProviderAttributes>, client?: PrismaClientOrTransaction) => Promise<Provider>
    deleteProvider: (userId: number, providerId: number, client?: PrismaClientOrTransaction) => Promise<Provider>
}