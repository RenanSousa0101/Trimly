import { Client } from "../generated/prisma"
import { PrismaClientOrTransaction } from "./ClientTransaction"

export interface ClientWhereParams {
    cpf?: string,
}

export interface FindClientParams {
    where?: ClientWhereParams
    sortBy?: "cpf"
    order?: "asc" | "desc"
    skip?: number
    take?: number
}

export interface CreateClientAttributes {
    cpf: string
    communication_preference?: string
}

export interface FullClientAttributes {
    cpf: string
    communication_preference?: string
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

export interface IclientRepository {
    findClients: (params: FindClientParams, client?: PrismaClientOrTransaction) => Promise<Client[]>
    findByIdClient: (userId: number, clientId: number, client?: PrismaClientOrTransaction) => Promise<Client | null>
    findGlobalByClientId: (clientId: number, client?: PrismaClientOrTransaction) => Promise<Client | null>
    createClient: (userId: number, addressId: number, phoneId: number, attributes: CreateClientAttributes, client?: PrismaClientOrTransaction) => Promise<Client>
    countClient: (where: ClientWhereParams, client?: PrismaClientOrTransaction) => Promise<number>;
    updateClient: (userId: number, clientId: number, attributes: Partial<CreateClientAttributes>, client?: PrismaClientOrTransaction) => Promise<Client>
    deleteClient: (userId: number, clientId: number, client?: PrismaClientOrTransaction) => Promise<Client>
}