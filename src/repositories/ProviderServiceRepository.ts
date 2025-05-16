import { Decimal } from "@prisma/client/runtime/library";
import { PrismaClientOrTransaction } from "./ClientTransaction";

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
    price: number,
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
    price: number
    duration: number
}

export interface AddProviderServiceAttributes {
    price: number
    duration: number
    nameService: string
}

export interface IproviderServiceRepository {
    findProviderServices: (userId: number, providerId: number, params: FindProviderServiceParams, client?: PrismaClientOrTransaction) => Promise<FindFullProviderService[]>
    findByProviderServiceId: (userId: number, providerId: number, providerServiceId: number, client?: PrismaClientOrTransaction) => Promise<FindFullProviderService | null>
    findByProviderExistServiceId: (userId: number, providerId: number, serviceId: number, client?: PrismaClientOrTransaction) => Promise<FindFullProviderService | null>
    createProviderService: (providerId: number, serviceId: number, attributes: CreateProviderServiceAttributes, client?: PrismaClientOrTransaction) => Promise<FindFullProviderService>
    countProviderService: (where: ProviderServiceWhereParams, client?: PrismaClientOrTransaction) => Promise<number>;
    updateProviderService: (providerId: number, providerServiceId: number, attributes: Partial<CreateProviderServiceAttributes>, newServiceId?: Partial<number>, client?: PrismaClientOrTransaction) => Promise<FindFullProviderService>
    deleteProviderService: (providerId: number, providerServiceId: number, client?: PrismaClientOrTransaction) => Promise<FindFullProviderService>
}