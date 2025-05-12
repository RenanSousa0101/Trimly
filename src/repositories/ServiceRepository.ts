import { Service_Category } from "../generated/prisma/client";
import { Decimal } from "../generated/prisma/runtime/library";
import { PrismaClientOrTransaction } from "./ClientTransaction";


export interface ServiceCategoryWhereParams {
    name?: {
        contains?: string
        equals?: string
        mode?: "default" | "insensitive"
    }
}

export interface FindServiceCategoryParams {
    where?: ServiceCategoryWhereParams
    sortBy?: "name"
    order?: "asc" | "desc"
    skip?: number
    take?: number
}

export interface CreateServiceCategory {
    name: string
    description?: string
}

export interface CreateServiceProvicerAttributes {
    nameService: string
    descriptionService: string
    price: Decimal
    duration: number
    nameCategory: string
    description: string
}

export interface IserviceRepository { 
    findServiceCategory: (params: FindServiceCategoryParams, client?: PrismaClientOrTransaction) => Promise<Service_Category[] | null>
    findByServiceCategoryId: (serviceCategoryId: number, client?: PrismaClientOrTransaction) => Promise<Service_Category | null>
    createServiceCategory: (attributes: CreateServiceCategory, client?: PrismaClientOrTransaction) => Promise<Service_Category>
    updateServiceCategory: (serviceCategoryId: number, attributes: Partial<CreateServiceCategory>, client?: PrismaClientOrTransaction) => Promise<Service_Category>
    deleteServiceCategory: (serviceCategoryId: number, client?: PrismaClientOrTransaction) => Promise<Service_Category>
}