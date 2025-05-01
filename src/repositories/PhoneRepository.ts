import { Phone, PhoneType } from "../generated/prisma";

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
    findByUserIdPhone:(userId: number) => Promise<FindPhoneAttributes[]>
    findByUserIdPhoneId:(userId: number, phoneId: number) => Promise<Phone | null>
    createPhone:(userId: number, attributes: CreatePhoneAttributes) => Promise<Phone>
    updateByIdPhone:(userId: number, phoneId: number, attributes: Partial<CreatePhoneAttributes>) => Promise<Phone | null>
    deleteByIdPhone:(userId: number, phoneId: number) => Promise<Phone | null>
}