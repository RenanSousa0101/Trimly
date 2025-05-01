import { User } from "../generated/prisma";

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
    find: (params: FindUserParams) => Promise<User[]>;
    findById: (id: number) => Promise<FullUserDate | null>;
    findByEmail: (email: string) => Promise<User | null>;
    count: (where: UserWhereParams) => Promise<number>;
    create: (attributes: CreateUserAttributes) => Promise<User>;
    register: (attributes: RegisterUser) => Promise<ReturnRegisterUser>
    updateById: (id: number, attributes: Partial<CreateUserAttributes>) => Promise<User | null>;
    deleteById: (id: number) => Promise<User | null>;
}