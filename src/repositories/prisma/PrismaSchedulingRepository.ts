import { Scheduling } from "../../../prisma/prisma";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import { CreateScheduling, FullScheduling, IschedulingRepository } from "../SchedulingRepository";

export class PrismaSchedulingRepository implements IschedulingRepository {

    constructor(private readonly prisma: PrismaClient) {}

    findByProviderIdScheduling(providerId: number, client?: PrismaClientOrTransaction): Promise<Scheduling[]> {
        const prismaClient = client || this.prisma;

        return prismaClient.scheduling.findMany({
            where: { provider_id: providerId }
        })
    }

    findByClientIdScheduling(clientId: number, client?: PrismaClientOrTransaction): Promise<Scheduling[]> {
        const prismaClient = client || this.prisma;

        return prismaClient.scheduling.findMany({
            where: { client_id: clientId }
        })
    }

    createScheduling(clientId: number, providerId: number, serviceId: number, attributes: CreateScheduling, client?: PrismaClientOrTransaction): Promise<FullScheduling> {
        const prismaClient = client || this.prisma;

        return prismaClient.scheduling.create({
            data: {
                client_id: clientId,
                provider_id: providerId,
                service_id: serviceId,
                ...attributes
            },
            include: {
                Client: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                avatar_url: true
                            }
                        },
                        user_id: true,
                        phone_id: true,
                        address_id: true
                    }
                },
                Service: {
                    select: {
                        Service_Category: {
                            select: {
                                name: true,
                                description: true
                            }
                        },
                        Provider_Service: {
                            select: {
                                id: true,
                                service_id: true,
                                price: true,
                                duration: true
                            }
                        },
                        name: true,
                        description: true
                    }
                },
                Provider: {
                    select: {
                        user: {
                            select: {
                                name: true,
                            }
                        },
                        user_id: true,
                        phone_id: true,
                        address_id: true,
                        business_name: true,
                        cnpj: true,
                        logo_url: true,
                        banner_url:true,
                        avarage_rating: true,
                        description: true
                    }
                }
            }
        })
    }
    
}