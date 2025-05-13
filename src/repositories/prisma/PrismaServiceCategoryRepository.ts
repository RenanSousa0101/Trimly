import { PrismaClient, Service_Category } from "../../generated/prisma/client";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import { CreateServiceCategory, FindServiceCategoryParams, IserviceCategoryRepository, ServiceCategoryWhereParams } from "../ServiceCategoryRepository";

export class PrismaServiceCategoryRepository implements IserviceCategoryRepository {

    constructor(private readonly prisma: PrismaClient) {}

    async findServiceCategory(params: FindServiceCategoryParams, client?: PrismaClientOrTransaction): Promise<Service_Category[] | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.service_Category.findMany({
            where: {
                name: {
                    contains: params.where?.name?.contains,
                    equals: params.where?.name?.equals,
                    mode: params.where?.name?.mode,
                }
            },
            orderBy: { [params.sortBy ?? "name"]: params.order || "asc" },
            skip: params.skip,
            take: params.take,
            select: {
                id: true,
                name: true,
                description: true,
                created_at: true, 
                updated_at: true,
            }
        })
    }

    async findByServiceCategoryId(serviceCategoryId: number, client?: PrismaClientOrTransaction): Promise<Service_Category | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.service_Category.findUnique({
            where: {id: serviceCategoryId }
        })
    }

    findByServiceCategoryName(serviceCategoryName: string, client?: PrismaClientOrTransaction): Promise<Service_Category | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.service_Category.findFirst({
            where: {name: serviceCategoryName }
        })
    }

    countServiceCategory(where: ServiceCategoryWhereParams, client?: PrismaClientOrTransaction): Promise<number> {
        const prismaClient = client || this.prisma;

        return prismaClient.service_Category.count({
            where: {
                name: {
                    contains: where.name?.contains,
                    equals: where.name?.equals,
                    mode: where.name?.mode,
                }
            }
        })
    }

    async createServiceCategory(attributes: CreateServiceCategory, client?: PrismaClientOrTransaction): Promise<Service_Category> {
        const prismaClient = client || this.prisma;

        return prismaClient.service_Category.create({
            data: { ...attributes }
        })
    }

    async updateServiceCategory(serviceCategoryId: number, attributes: Partial<CreateServiceCategory>, client?: PrismaClientOrTransaction): Promise<Service_Category> {
        const prismaClient = client || this.prisma;

        return prismaClient.service_Category.update({
            where: { id: serviceCategoryId },
            data: { ...attributes }
        })
    }

    async deleteServiceCategory(serviceCategoryId: number, client?: PrismaClientOrTransaction): Promise<Service_Category> {
        const prismaClient = client || this.prisma;

        return prismaClient.service_Category.delete({
            where: { id: serviceCategoryId }
        })
    }

}