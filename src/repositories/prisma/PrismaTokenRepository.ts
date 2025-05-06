import { prisma } from "../../database";
import { Prisma, PrismaClient, TokenType, User, VerificationToken } from "../../generated/prisma";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import {
    CreateToken,
    ItokenRepository,
    ReturnFindToken,
    VerificationUserToken,
} from "../TokenRepository";

export class PrismaTokenRepository implements ItokenRepository {

    constructor(private readonly prisma: PrismaClient) {}

    async findToken(token: string, client?: PrismaClientOrTransaction): Promise<ReturnFindToken | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.verificationToken.findUnique({
            where: { token: token },
            include: {
                user: {
                    select: {
                        isEmailVerified: true,
                    },
                },
            },
        });
    }

    async deleteUserIdToken(userId: number, type: TokenType, client?: PrismaClientOrTransaction): Promise<Prisma.BatchPayload> {
        const prismaClient = client || this.prisma;

        return prismaClient.verificationToken.deleteMany({
            where: {
                user_id: userId,
                type,
            },
        });
    }

    async createToken(userId: number, attributes: CreateToken, client?: PrismaClientOrTransaction): Promise<VerificationToken | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.verificationToken.create({
            data: {
                token: attributes.token,
                user_id: userId,
                type: attributes.type,
                expiresAt: attributes.expiresAt,
            },
        });
    }

    async updateTokenUser(id: number, client?: PrismaClientOrTransaction): Promise<VerificationUserToken | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.user.update({
            where: { id },
            data: { isEmailVerified: true },
        });
    }

    async deleteToken(tokenId: number, client?: PrismaClientOrTransaction): Promise<VerificationToken | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.verificationToken.delete({ where: { id: tokenId } });
    }

    updateTokenUserPassword (id: number, newPassword: string, client?: PrismaClientOrTransaction): Promise<User | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.user.update({
            where: { id },
            data: { password: newPassword },
        });
    }
}
