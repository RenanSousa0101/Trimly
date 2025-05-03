import { Prisma, TokenType, VerificationToken } from "../generated/prisma";

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
    findToken: (token: string) => Promise<ReturnFindToken | null>
    createToken: (userId: number, attributes: CreateToken ) => Promise<VerificationToken | null>
    updateTokenUser: (id: number) => Promise<VerificationUserToken | null>
    deleteToken: (tokenId: number) => Promise<VerificationToken | null>
    deleteUserIdToken: (userId: number) => Promise< Prisma.BatchPayload >
}