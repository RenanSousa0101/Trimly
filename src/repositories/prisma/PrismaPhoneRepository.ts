import { prisma } from "../../database"
import { Phone } from "../../generated/prisma"
import { CreatePhoneAttributes, FindPhoneAttributes, IphoneRepository } from "../PhoneRepository"

export class PrismaPhoneRepository implements IphoneRepository {
    async findByUserIdPhone(userId: number): Promise<FindPhoneAttributes[]> {
        return prisma.phone.findMany({
            where: { user_id: userId }
        })
    }

    async findByUserIdPhoneId(userId: number, phoneId: number): Promise<Phone | null> {
        return prisma.phone.findUnique({
            where: { user_id: userId, id: phoneId }
        })
    }

    async createPhone(userId: number, attributes: CreatePhoneAttributes): Promise<Phone> {
        return prisma.phone.create({
            data: {
                ...attributes,
                user_id: userId
            }
        })
    }

    async updateByIdPhone(userId: number, phoneId: number ,attributes: Partial<CreatePhoneAttributes>): Promise<Phone | null> {
        return prisma.phone.update({
            where: { user_id: userId, id: phoneId },
            data: attributes
        })
    }
    async deleteByIdPhone(userId: number, phoneId: number): Promise<Phone | null> {
        return prisma.phone.delete({
            where: {user_id: userId, id: phoneId }
        })
    }
}