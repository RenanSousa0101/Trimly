import { Phone, PhoneType } from "../generated/prisma/client";
import { PrismaClientOrTransaction } from "./ClientTransaction";

export interface CreatePhoneAttributes {
    phone_number: string
    phone_type: PhoneType
    is_primary?: boolean
}

export interface FindPhoneAttributes {
    id: number
    phone_number: string
    phone_type: PhoneType
    is_primary: boolean
}[]
export interface IphoneRepository {
    findByUserIdPhone:(userId: number, client?: PrismaClientOrTransaction) => Promise<FindPhoneAttributes[]>
    findByUserIdPhoneId:(userId: number, phoneId: number, client?: PrismaClientOrTransaction) => Promise<Phone | null>
    createPhone:(userId: number, attributes: CreatePhoneAttributes, client?: PrismaClientOrTransaction) => Promise<Phone>
    updateByIdPhone:(userId: number, phoneId: number, attributes: Partial<CreatePhoneAttributes>, client?: PrismaClientOrTransaction) => Promise<Phone | null>
    deleteByIdPhone:(userId: number, phoneId: number, client?: PrismaClientOrTransaction) => Promise<Phone | null>
}