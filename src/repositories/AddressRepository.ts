import { Address, AddressType } from "../generated/prisma/client"
import { PrismaClientOrTransaction } from "./ClientTransaction"

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

export interface UpdateAddressAttributes {
    street?: string; 
    number?: string; 
    cep_street?: string; 
    complement?: string | null; 
    address_type?: AddressType; 
    district?: { 
        name?: string; 
        city?: { 
            name?: string; 
            state?: { 
                name?: string; 
                uf?: string;   
                country?: { 
                    name?: string;    
                    acronym?: string; 
                }
            }
        }
    };
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

export interface FullAddressAttributes {
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
}

export interface IaddressRepository {
    findByUserIdAddress:(userId: number, client?: PrismaClientOrTransaction) => Promise<FindAddressAttributes[]>
    findByUserIdAddressId:(userId: number, addressId: number, client?: PrismaClientOrTransaction) => Promise<FullAddressAttributes | null>
    createAddress:(userId: number, attributes: CreateAddressAttributes, client?: PrismaClientOrTransaction) => Promise<Address>
    updateByIdAddress:(userId: number, addressId: number, attributes: UpdateAddressAttributes, client?: PrismaClientOrTransaction) => Promise<Address | null>
    deleteByIdAddress:(userId: number, addressId: number, client?: PrismaClientOrTransaction) => Promise<Address | null>
}