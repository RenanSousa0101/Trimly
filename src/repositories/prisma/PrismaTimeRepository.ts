import { PrismaClient, Time } from "../../generated/prisma/client";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import { CreateTimeAttributes, ItimeRepository } from "../TimeRepository";

export class PrismaTimeRepository implements ItimeRepository {

    constructor(private readonly prisma: PrismaClient) {}
    
    async findTime(providerId: number, client?: PrismaClientOrTransaction):  Promise<Time[] | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.time.findMany({
            where: { provider_id: providerId }
        })
    }
    async findByTimeId(providerId: number, timeId: number, client?: PrismaClientOrTransaction):  Promise<Time | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.time.findUnique({
            where: { provider_id: providerId, id: timeId }
        })
    }
    async createTime(providerId: number, attributes: CreateTimeAttributes, client?: PrismaClientOrTransaction):  Promise<Time> {
        const prismaClient = client || this.prisma;

        return prismaClient.time.create({
            data: {
                ...attributes,
                provider_id: providerId
            }
        })
    }
    async updateTime(providerId: number, timeId: number, attributes: Partial<CreateTimeAttributes>, client?: PrismaClientOrTransaction):  Promise<Time> {
        const prismaClient = client || this.prisma;

        return prismaClient.time.update({
            where: { provider_id: providerId, id: timeId },
            data: attributes
        })
    }
    async deleteTime(providerId: number, timeId: number, client?: PrismaClientOrTransaction):  Promise<Time> {
        const prismaClient = client || this.prisma;

        return prismaClient.time.delete({
            where: {provider_id: providerId, id: timeId }
        })
    }
        
}