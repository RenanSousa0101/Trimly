import { userWithFullAddressSelect } from "../prisma/utils/userWithFullAddressSelect";
import { prisma } from "../../database";
import { User } from "../../generated/prisma";
import { CreateUserAttributes, FindUserParams, FullUserDate, IuserRepository, UserWhereParams } from "../UserRepository";

export class PrismaUserRepository implements IuserRepository {
    async find(params: FindUserParams): Promise<User[]> {
        return prisma.user.findMany({
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
        })
    }

    async findById(id: number): Promise<FullUserDate | null> {
        return prisma.user.findUnique({
            where: { id },
            select: userWithFullAddressSelect
        })
    }

    async count(where: UserWhereParams): Promise<number> {
        return prisma.user.count({
            where: {
                name: {
                    contains: where.name?.contains,
                    equals: where.name?.equals,
                    mode: where.name?.mode,
                }
            }
        })
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        })
    }

    async create(attributes: CreateUserAttributes): Promise<User> {
        return prisma.user.create({ data: attributes })
    }

    async updateById(id: number, attributes: Partial<CreateUserAttributes>): Promise<User> {
        return prisma.user.update({
            where: { id },
            data: attributes
        })
    }

    async deleteById(id: number): Promise<User> {
        return prisma.user.delete({ where: { id } })
    }
}