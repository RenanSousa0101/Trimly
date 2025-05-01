import { Address, AddressType } from "../generated/prisma"

export interface CreateAddressAttributes {
    street: string
    number: string
    cep_street: string
    complement?: string | null 
    address_type: AddressType
    district: {
        name: string
        city: {
            name: string
            state: {
                name: string
                uf: string
                country: {
                    name: string
                    acronym: string
                }
            }
        }
    }
}

export interface FindAddressAttributes {
    id: number
    street: string
    number: string
    cep_street: string
    complement: string | null
    address_type: AddressType
    district: {
        name: string
        city: {
            name: string
            state: {
                name: string
                uf: string
                country: {
                    name: string
                    acronym: string
                }
            }
        }
    }
}[]

export interface IaddressRepository {
    findByUserIdAddress:(userId: number) => Promise<FindAddressAttributes[]>
    findByUserIdAddressId:(userId: number, addressId: number) => Promise<Address | null>
    createAddress:(userId: number, attributes: CreateAddressAttributes) => Promise<Address>
    updateByIdAddress:(userId: number, addressId: number, attributes: Partial<CreateAddressAttributes>) => Promise<Address | null>
    deleteByIdAddress:(userId: number, addressId: number) => Promise<Address | null>
}