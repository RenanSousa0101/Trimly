import { Decimal } from "@prisma/client/runtime/library";
import { PrismaClientOrTransaction } from "./ClientTransaction";
import { Provider_Service } from "../generated/prisma";

export interface ProviderServiceWhereParams {
    name?: {
        contains?: string
        equals?: string
        mode?: "default" | "insensitive"
    }
}

export interface FindProviderServiceParams {
    where?: ProviderServiceWhereParams
    sortBy?: "name" | "created_at" | "updated_at" | "price" | "duration"
    order?: "asc" | "desc"
    skip?: number
    take?: number
}

export interface FindFullProviderService {
    id: number,
    price: Decimal,
    duration: number,
    created_at: Date,
    updated_at: Date,
    Service: {
        id: number,
        name: string,
        description?: string | null,
        Service_Category: {
            id: number,
            name: string,
            description?: string | null
        }

    }
}

export interface CreateProviderServiceAttributes {
    price: Decimal
    duration: number
}

export interface IproviderServiceRepository {
    findProviderServices: (userId: number, providerId: number, params: FindProviderServiceParams, client?: PrismaClientOrTransaction) => Promise<FindFullProviderService[]>
    findByProviderServiceId: (userId: number, providerId: number, serviceId: number, client?: PrismaClientOrTransaction) => Promise<FindFullProviderService | null>
    createProviderService: (providerId: number, serviceId: number, attributes: CreateProviderServiceAttributes, client?: PrismaClientOrTransaction) => Promise<Provider_Service>
    countProviderService: (where: ProviderServiceWhereParams, client?: PrismaClientOrTransaction) => Promise<number>;
    updateProviderService: (providerId: number, serviceId: number, attributes: Partial<CreateProviderServiceAttributes>, client?: PrismaClientOrTransaction) => Promise<Provider_Service>
    deleteProviderService: (providerId: number, serviceId: number, client?: PrismaClientOrTransaction) => Promise<Provider_Service>
}