import { PrismaClient, Provider } from "../../generated/prisma/client";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import { CreateProviderAttributes, FindProviderParams, IproviderRepository, ProviderWhereParams } from "../ProviderRepository";

export class PrismaProviderRepository implements IproviderRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findProviders(params: FindProviderParams, client?: PrismaClientOrTransaction): Promise<Provider[]> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider.findMany({
            where: {
                business_name: {
                    contains: params.where?.business_name?.contains,
                    equals: params.where?.business_name?.equals,
                    mode: params.where?.business_name?.mode,
                },
                cnpj: params.where?.cnpj,
                cpf: params.where?.cpf
            },
            orderBy: { [params.sortBy ?? "business_name"]: params.order || "asc" },
            skip: params.skip,
            take: params.take,
            select: {
                id: true,
                user_id: true,
                phone_id: true,
                address_id: true,
                business_name: true,
                cnpj: true,
                cpf: true,
                description: true,
                logo_url: true,
                banner_url: true,
                avarage_rating: true,
                created_at: true,
                updated_at: true,
            }
        })
    }

    async countProvider(where: ProviderWhereParams, client?: PrismaClientOrTransaction): Promise<number> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider.count({
            where: {
                business_name: {
                    contains: where.business_name?.contains,
                    equals: where.business_name?.equals,
                    mode: where.business_name?.mode,
                },
                cnpj: where?.cnpj,
                cpf: where?.cpf
            }
        })
    }

    async findByIdProvider(userId: number, providerId: number, client?: PrismaClientOrTransaction): Promise<Provider | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider.findUnique({
            where: {user_id: userId, id: providerId}
        })
    }

    async createProvider(userId: number, addressId: number, phoneId: number, attributes: CreateProviderAttributes, client?: PrismaClientOrTransaction): Promise<Provider> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider.create({
            data: {
                ...attributes,
                user_id: userId,
                phone_id: phoneId,
                address_id: addressId
            },
        })
    }

    async updateProvider(userId: number, providerId: number, attributes: Partial<CreateProviderAttributes>, client?: PrismaClientOrTransaction): Promise<Provider> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider.update({
            where: {user_id: userId, id: providerId},
            data: {
                ...attributes
            }
        })
    }
}