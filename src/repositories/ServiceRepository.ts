import { Service } from "../generated/prisma/client";
import { PrismaClientOrTransaction } from "./ClientTransaction";

export interface ServiceWhereParams {
    name?: {
        contains?: string
        equals?: string
        mode?: "default" | "insensitive"
    }
}

export interface FindServiceParams {
    where?: ServiceWhereParams
        sortBy?: "name"
        order?: "asc" | "desc"
        skip?: number
        take?: number
}

export interface CreateService {
    name: string
    description: string
    service_category_id: number;
}

export interface AddService {
    name: string
    description: string
    serviceCategoryName: string
} 

export interface IserviceRepository {
    findService: (params: FindServiceParams, client?: PrismaClientOrTransaction) => Promise<Service[] | null>
    findByServiceId: (serviceId: number, client?: PrismaClientOrTransaction) => Promise<Service | null>
    findByServiceName: (serviceName: string, client?: PrismaClientOrTransaction) => Promise<Service | null>
    countService: (where: ServiceWhereParams, client?: PrismaClientOrTransaction) => Promise<number>
    createService: (attributes: CreateService, client?: PrismaClientOrTransaction) => Promise<Service>
    updateService: (serviceId: number, attributes: Partial<CreateService>, client?: PrismaClientOrTransaction) => Promise<Service>
    deleteService: (serviceId: number, client?: PrismaClientOrTransaction) => Promise<Service>
}