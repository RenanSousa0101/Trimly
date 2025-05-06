import { prisma } from "../../database"
import { Phone, PrismaClient } from "../../generated/prisma/client"
import { PrismaClientOrTransaction } from "../ClientTransaction"
import { CreatePhoneAttributes, FindPhoneAttributes, IphoneRepository } from "../PhoneRepository"

export class PrismaPhoneRepository implements IphoneRepository {

    constructor(private readonly prisma: PrismaClient) {}

    async findByUserIdPhone(userId: number, client?: PrismaClientOrTransaction): Promise<FindPhoneAttributes[]> {
        const prismaClient = client || this.prisma;

        return prismaClient.phone.findMany({
            where: { user_id: userId }
        })
    }

    async findByUserIdPhoneId(userId: number, phoneId: number, client?: PrismaClientOrTransaction): Promise<Phone | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.phone.findUnique({
            where: { user_id: userId, id: phoneId }
        })
    }

    async createPhone(userId: number, attributes: CreatePhoneAttributes, client?: PrismaClientOrTransaction): Promise<Phone> {
        const prismaClient = client || this.prisma;

        return prismaClient.phone.create({
            data: {
                ...attributes,
                user_id: userId
            }
        })
    }

    async updateByIdPhone(userId: number, phoneId: number ,attributes: Partial<CreatePhoneAttributes>, client?: PrismaClientOrTransaction): Promise<Phone | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.phone.update({
            where: { user_id: userId, id: phoneId },
            data: attributes
        })
    }
    async deleteByIdPhone(userId: number, phoneId: number, client?: PrismaClientOrTransaction): Promise<Phone | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.phone.delete({
            where: {user_id: userId, id: phoneId }
        })
    }
}