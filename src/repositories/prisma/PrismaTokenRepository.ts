import { prisma } from "../../database";
import { Prisma, TokenType, User, VerificationToken } from "../../generated/prisma";
import {
    CreateToken,
    ItokenRepository,
    ReturnFindToken,
    VerificationUserToken,
} from "../TokenRepository";

export class PrismaTokenRepository implements ItokenRepository {
    async findToken(token: string): Promise<ReturnFindToken | null> {
        return prisma.verificationToken.findUnique({
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

    async deleteUserIdToken(userId: number, type: TokenType): Promise<Prisma.BatchPayload> {
        return prisma.verificationToken.deleteMany({
            where: {
                user_id: userId,
                type,
            },
        });
    }

    async createToken(userId: number, attributes: CreateToken): Promise<VerificationToken | null> {
        return prisma.verificationToken.create({
            data: {
                token: attributes.token,
                user_id: userId,
                type: attributes.type,
                expiresAt: attributes.expiresAt,
            },
        });
    }

    async updateTokenUser(id: number): Promise<VerificationUserToken | null> {
        return prisma.user.update({
            where: { id },
            data: { isEmailVerified: true },
        });
    }

    async deleteToken(tokenId: number): Promise<VerificationToken | null> {
        return prisma.verificationToken.delete({ where: { id: tokenId } });
    }

    updateTokenUserPassword (id: number, newPassword: string): Promise<User | null> {
        return prisma.user.update({
            where: { id },
            data: { password: newPassword },
        });
    }
}
