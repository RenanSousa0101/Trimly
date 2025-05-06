import { userWithFullAddressSelect } from "../prisma/utils/userWithFullAddressSelect";
import { prisma } from "../../database";
import { PrismaClient, User } from "../../generated/prisma/client";
import { CreateUserAttributes, FindUserParams, FullUserDate, IuserRepository, RegisterUser, ReturnRegisterUser, returnUser, UserWhereParams } from "../UserRepository";
import bcrypt from "bcrypt";
import { PrismaClientOrTransaction } from "../ClientTransaction";

export class PrismaUserRepository implements IuserRepository {

    constructor(private readonly prisma: PrismaClient) {}

    async find(params: FindUserParams, client?: PrismaClientOrTransaction): Promise<returnUser[]> {
        const prismaClient = client || this.prisma;

        return prismaClient.user.findMany({
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
            select: {
                id: true,
                name: true,
                email: true,
                avatar_url: true,
                bio: true,
                created_at: true, 
                updated_at: true,
            }
        })
    }

    async findById(id: number, client?: PrismaClientOrTransaction): Promise<FullUserDate | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.user.findUnique({
            where: { id },
            select: userWithFullAddressSelect
        })
    }

    async count(where: UserWhereParams, client?: PrismaClientOrTransaction): Promise<number> {
        const prismaClient = client || this.prisma;

        return prismaClient.user.count({
            where: {
                name: {
                    contains: where.name?.contains,
                    equals: where.name?.equals,
                    mode: where.name?.mode,
                }
            }
        })
    }

    async findByEmail(email: string, client?: PrismaClientOrTransaction): Promise<User | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.user.findUnique({
            where: { email }
        })
    }

    async create(roleId: number, attributes: CreateUserAttributes, client?: PrismaClientOrTransaction): Promise<User> {
        const prismaClient = client || this.prisma;

        return prismaClient.user.create({ 
            data: {...attributes, 
                password: bcrypt.hashSync(attributes.password, 10),
                User_Roles: {
                    create: {
                        roles_id: roleId
                    }
                }
            } 
        })
    }

    async register(roleId: number, attributes: RegisterUser, client?: PrismaClientOrTransaction): Promise<ReturnRegisterUser> {
        const prismaClient = client || this.prisma;

        return prismaClient.user.create({
            data: {
                ...attributes,
                password: bcrypt.hashSync(attributes.password, 10),
                User_Roles: {
                    create: {
                        roles_id: roleId
                    }
                },
                isEmailVerified: false
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });
    }

    async updateById(id: number, attributes: Partial<CreateUserAttributes>, client?: PrismaClientOrTransaction): Promise<User> {
        const prismaClient = client || this.prisma;

        return prismaClient.user.update({
            where: { id },
            data: attributes
        })
    }

    async deleteById(id: number, client?: PrismaClientOrTransaction): Promise<User> {
        const prismaClient = client || this.prisma;

        return prismaClient.user.delete({ where: { id } })
    }
}