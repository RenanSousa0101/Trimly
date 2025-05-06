import { PrismaClient, Provider } from "../../generated/prisma/client";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import { CreateProviderAttributes, FindProviderParams, IproviderRepository, ProviderWhereParams } from "../ProviderRepository";

export class PrismaProviderRepository implements IproviderRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findProvider(params: FindProviderParams, client?: PrismaClientOrTransaction): Promise<Provider[]> {
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

    countProvider(where: ProviderWhereParams, client?: PrismaClientOrTransaction): Promise<number> {
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

    async createProvider(userId: number, attributes: CreateProviderAttributes, client?: PrismaClientOrTransaction): Promise<Provider> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider.create({
            data: {
                ...attributes,
                user_id: userId
            },
        })
    }
}