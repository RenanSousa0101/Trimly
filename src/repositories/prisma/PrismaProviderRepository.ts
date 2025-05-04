import { prisma } from "../../database";
import { Provider } from "../../generated/prisma";
import { CreateProviderAttributes, IproviderRepository } from "../ProviderRepository";

export class PrismaProviderRepository implements IproviderRepository {
    async createProvider(userId: number, attributes: CreateProviderAttributes): Promise<Provider> {
        return prisma.provider.create({
            data: {
                ...attributes,
                user_id: userId
            },
        })
    }
}