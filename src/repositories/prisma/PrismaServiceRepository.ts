import { PrismaClient, Service } from "../../generated/prisma/client";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import { CreateService, FindServiceParams, IserviceRepository, ServiceWhereParams } from "../ServiceRepository";

export class PrismaServiceRepository implements IserviceRepository {

    constructor(private readonly prisma: PrismaClient) {}

    findService(params: FindServiceParams, client?: PrismaClientOrTransaction): Promise<Service[] | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.service.findMany({
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
                service_category_id: true,
                name: true,
                description: true,
                created_at: true, 
                updated_at: true,
            }
        })
    }

    findByServiceId(serviceId: number, client?: PrismaClientOrTransaction): Promise<Service | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.service.findUnique({
            where: {id: serviceId }
        })
    }

    findByServiceName(serviceName: string, client?: PrismaClientOrTransaction): Promise<Service | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.service.findFirst({
            where: {name: serviceName }
        })
    }

    countService(where: ServiceWhereParams, client?: PrismaClientOrTransaction): Promise<number> {
        const prismaClient = client || this.prisma;

        return prismaClient.service.count({
            where: {
                name: {
                    contains: where.name?.contains,
                    equals: where.name?.equals,
                    mode: where.name?.mode,
                }
            }
        })
    }

    createService(attributes: CreateService, client?: PrismaClientOrTransaction): Promise<Service> {
        const prismaClient = client || this.prisma;

        return prismaClient.service.create({
            data: { ...attributes }
        })
    }

    updateService(serviceId: number, attributes: Partial<CreateService>, client?: PrismaClientOrTransaction): Promise<Service> {
        const prismaClient = client || this.prisma;

        return prismaClient.service.update({
            where: { id: serviceId },
            data: { ...attributes }
        })
    }

    deleteService(serviceId: number, client?: PrismaClientOrTransaction): Promise<Service> {
        const prismaClient = client || this.prisma;

        return prismaClient.service.delete({
            where: { id: serviceId }
        })
    }


}