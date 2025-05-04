import { AddressType, Provider } from "../generated/prisma"

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
    createProvider: (userId: number, attributes: CreateProviderAttributes) => Promise<Provider>
}