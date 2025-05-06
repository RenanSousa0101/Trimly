import { User } from "../generated/prisma";
import { PrismaClientOrTransaction } from "./ClientTransaction";

export interface UserWhereParams {
    name?: {
        contains?: string
        equals?: string
        mode?: "default" | "insensitive"
    }
}

export interface FindUserParams {
    where?: UserWhereParams
    sortBy?: "name"
    order?: "asc" | "desc"
    skip?: number
    take?: number
}

export interface returnUser {
    id: number
    name: string
    email: string
    avatar_url?: string | null
    bio?: string | null
    created_at: Date
    updated_at: Date
}[]

export interface CreateUserAttributes {
    name: string
    email: string
    password: string
    avatar_url?: string
    bio?: string
}

export interface RegisterUser {
    name: string
    email: string
    password: string
}

export interface LoginUser {
    email: string
    password: string
}

export interface ReturnRegisterUser {
    id: number
    name: string
    email: string
}

export interface FullUserDate {
    id: number
    User_Roles: {
        roles: {
            id: number
            role_type: string
        }
    }[];
    name: string
    email: string
    bio: string | null
    avatar_url: string | null
    Phone: {
        id: number
        phone_number: string
        phone_type: string
        is_primary: boolean
    }[];
    Address: {
        id: number
        street: string
        number: string
        cep_street: string
        complement: string | null
        address_type: string
        district: {
            id: number
            name: string
            city: {
                id: number
                name: string
                state: {
                    id: number
                    name: string
                    uf: string
                    country: {
                        id: number
                        name: string
                        acronym: string
                    }
                }
            }
        }
    }[];
}

export interface IuserRepository {
    find: (params: FindUserParams, client?: PrismaClientOrTransaction) => Promise<returnUser[] | null>;
    findById: (id: number, client?: PrismaClientOrTransaction) => Promise<FullUserDate | null>;
    findByEmail: (email: string, client?: PrismaClientOrTransaction) => Promise<User | null>;
    count: (where: UserWhereParams, client?: PrismaClientOrTransaction) => Promise<number>;
    create: (roleId: number, attributes: CreateUserAttributes, client?: PrismaClientOrTransaction) => Promise<User>;
    register: (roleId: number, attributes: RegisterUser, client?: PrismaClientOrTransaction) => Promise<ReturnRegisterUser>
    updateById: (id: number, attributes: Partial<CreateUserAttributes>, client?: PrismaClientOrTransaction) => Promise<User | null>;
    deleteById: (id: number, client?: PrismaClientOrTransaction) => Promise<User | null>;
}