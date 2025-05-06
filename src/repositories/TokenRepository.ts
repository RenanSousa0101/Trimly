import { Prisma, TokenType, User, VerificationToken } from "../generated/prisma/client";
import { PrismaClientOrTransaction } from "./ClientTransaction";

export interface VerificationUserToken {
    isEmailVerified: boolean
}

export interface TokenId {
    id: number
}

export interface ReturnFindToken {
    id: number
    user_id: number
    token: string
    type: TokenType
    expiresAt: Date
    user: {
        isEmailVerified: boolean
    }
}

export interface CreateToken {
    token: string
    type: TokenType
    expiresAt: Date
}

export interface ItokenRepository {
    findToken: (token: string, client?: PrismaClientOrTransaction) => Promise<ReturnFindToken | null>
    createToken: (userId: number, attributes: CreateToken, client?: PrismaClientOrTransaction) => Promise<VerificationToken | null>
    updateTokenUser: (id: number, client?: PrismaClientOrTransaction) => Promise<VerificationUserToken | null>
    updateTokenUserPassword: (id: number, newPassword: string, client?: PrismaClientOrTransaction) => Promise<User | null>
    deleteToken: (tokenId: number, client?: PrismaClientOrTransaction) => Promise<VerificationToken | null>
    deleteUserIdToken: (userId: number, type: TokenType, client?: PrismaClientOrTransaction) => Promise< Prisma.BatchPayload >
}