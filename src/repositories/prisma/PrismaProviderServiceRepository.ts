import { PrismaClient, Provider_Service} from "../../generated/prisma/client";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import { CreateProviderServiceAttributes, FindFullProviderService, FindProviderServiceParams, IproviderServiceRepository, ProviderServiceWhereParams } from "../ProviderServiceRepository";

export class PrismaProviderServiceRepository implements IproviderServiceRepository {

    constructor(private readonly prisma: PrismaClient) {}

    findProviderServices(userId: number, providerId: number, params: FindProviderServiceParams, client?: PrismaClientOrTransaction): Promise<FindFullProviderService[]> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Service.findMany({
            where: {
                Provider: {
                    id: providerId,
                    user_id: userId
                },
                Service: {
                    name: {
                        contains: params.where?.name?.contains,
                        equals: params.where?.name?.equals,
                        mode: params.where?.name?.mode,
                    }
                }
            },
            orderBy: { [params.sortBy ?? "created_at"]: params.order || "asc" },
            skip: params.skip,
            take: params.take,
            select: {
                id: true,
                price: true,
                duration: true,
                created_at:true,
                updated_at: true,
                Service: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        Service_Category: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })
    }

    findByProviderExistServiceId(userId: number, providerId: number, serviceId: number, client?: PrismaClientOrTransaction): Promise<FindFullProviderService | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Service.findUnique({
            where: {
                Provider: {
                    user_id: userId
                },
                provider_id_service_id: {
                    provider_id: providerId,
                    service_id: serviceId
                }
            },
            select: {
                id: true,
                price: true,
                duration: true,
                created_at:true,
                updated_at: true,
                Service: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        Service_Category: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })
    }

    findByProviderServiceId(userId: number, providerId: number, providerServiceId: number, client?: PrismaClientOrTransaction): Promise<FindFullProviderService | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Service.findUnique({
            where: {
                id: providerServiceId,
                Provider: {
                    user_id: userId
                },
                provider_id: providerId
            },
            select: {
                id: true,
                price: true,
                duration: true,
                created_at:true,
                updated_at: true,
                Service: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        Service_Category: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })
    }

    createProviderService(providerId: number, serviceId: number, attributes: CreateProviderServiceAttributes, client?: PrismaClientOrTransaction): Promise<FindFullProviderService> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Service.create({
            data: { ...attributes, provider_id: providerId, service_id: serviceId },
            select: {
                id: true,
                price: true,
                duration: true,
                created_at:true,
                updated_at: true,
                Service: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        Service_Category: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })
    }

    countProviderService(where: ProviderServiceWhereParams, client?: PrismaClientOrTransaction): Promise<number> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Service.count({
            where: {
                Service: {
                    name: {
                        contains: where.name?.contains,
                        equals: where.name?.equals,
                        mode: where.name?.mode,
                    }
                }
            }
        })
    }

    updateProviderService(providerId: number, providerServiceId: number, attributes: Partial<CreateProviderServiceAttributes>, newServiceId?: Partial<number>, client?: PrismaClientOrTransaction): Promise<FindFullProviderService> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Service.update({
            where: {
                id: providerServiceId,
                provider_id: providerId
            },
            data: {
                ...attributes,
                service_id: newServiceId
            }, 
            select: {
                id: true,
                price: true,
                duration: true,
                created_at:true,
                updated_at: true,
                Service: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        Service_Category: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })
    }

    deleteProviderService(providerId: number, providerServiceId: number, client?: PrismaClientOrTransaction): Promise<FindFullProviderService> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Service.delete({
            where: {
                id: providerServiceId,
                provider_id: providerId
            },
            select: {
                id: true,
                price: true,
                duration: true,
                created_at:true,
                updated_at: true,
                Service: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        Service_Category: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })
    }
    
}