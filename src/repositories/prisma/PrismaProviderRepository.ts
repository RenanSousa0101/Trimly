import { PrismaClient, Provider } from "../../generated/prisma";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import { CreateProviderAttributes, IproviderRepository } from "../ProviderRepository";

export class PrismaProviderRepository implements IproviderRepository {
    constructor(private readonly prisma: PrismaClient) {}
    
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