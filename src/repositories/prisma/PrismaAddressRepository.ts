import { prisma } from "../../database"
import { Address, Prisma } from "../../generated/prisma"
import { CreateAddressAttributes, FindAddressAttributes } from "../AddressRepository"
import { addressWithFullAddressSelect } from "./utils/addressWithFullAddressSelect"

export class PrismaAddressRepository {
    async findByUserIdAddress(userId: number): Promise<FindAddressAttributes[]> {
        return prisma.address.findMany({
            where: { user_id: userId },
            select: addressWithFullAddressSelect
        })
    }

    async findByUserIdAddressId(userId: number, addressId: number): Promise<Address | null> {
        return prisma.address.findUnique({
            where: { user_id: userId, id: addressId }
        })
    }

    async createAddress(userId: number, attributes: CreateAddressAttributes): Promise<Address> {
        const country = await prisma.country.upsert({
            where: {
                acronym: attributes.district.city.state.country.acronym,
            },
            create: {
                name: attributes.district.city.state.country.name,
                acronym: attributes.district.city.state.country.acronym,
            },
            update: {
                name: attributes.district.city.state.country.name,
            },
            select: {
                id: true,
            },
        });

        const state = await prisma.state.upsert({
            where: {
                uf_country_id: {
                    uf: attributes.district.city.state.uf,
                    country_id: country.id,
                },
            },
            create: {
                name: attributes.district.city.state.name,
                uf: attributes.district.city.state.uf,
                country: {
                    connect: { id: country.id },
                },
            },
            update: {
                name: attributes.district.city.state.name,
            },
            select: {
                id: true,
            },
        });

        const city = await prisma.city.upsert({
            where: {
                name_state_id: {
                    name: attributes.district.city.name,
                    state_id: state.id,
                },
            },
            create: {
                name: attributes.district.city.name,
                state: {
                    connect: { id: state.id },
                },
            },
            update: {
                name: attributes.district.city.name,
            },
            select: {
                id: true,
            },
        });

        const district = await prisma.district.upsert({
            where: {
                name_city_id: {
                    name: attributes.district.name,
                    city_id: city.id,
                },
            },
            create: {
                name: attributes.district.name,
                city: {
                    connect: { id: city.id },
                },
            },
            update: {
                name: attributes.district.name,
            },
            select: {
                id: true,
            },
        });

        const newAddress = await prisma.address.create({
            data: {
                street: attributes.street,
                number: attributes.number,
                cep_street: attributes.cep_street,
                complement: attributes.complement || null,
                address_type: attributes.address_type,

                user: {
                    connect: { id: userId },
                },

                district: {
                    connect: { id: district.id },
                },
            },
        });

        return newAddress;
    }

    async updateByIdAddress(userId: number, addressId: number, attributes: Partial<CreateAddressAttributes>): Promise<Address | null> {
        const updateData: Prisma.AddressUpdateInput = {
            street: attributes.street,
            number: attributes.number,
            cep_street: attributes.cep_street,
            complement: attributes.complement, 
            address_type: attributes.address_type, 
        };

        let districtIdToConnect: number | undefined;

        if (attributes.district) {
            
            const country = await prisma.country.upsert({
                where: {
                    acronym: attributes.district.city.state.country.acronym,
                },
                create: {
                    name: attributes.district.city.state.country.name,
                    acronym: attributes.district.city.state.country.acronym,
                },
                update: {
                    name: attributes.district.city.state.country.name,
                },
                select: {
                    id: true, 
                },
            });

            const state = await prisma.state.upsert({
                where: {
                    uf_country_id: {
                        uf: attributes.district.city.state.uf,
                        country_id: country.id,
                    },
                },
                create: {
                    name: attributes.district.city.state.name,
                    uf: attributes.district.city.state.uf,
                    country: {
                        connect: { id: country.id },
                    },
                },
                update: {
                    name: attributes.district.city.state.name,
                },
                select: {
                    id: true,
                },
            });

            const city = await prisma.city.upsert({
                where: {
                    name_state_id: {
                        name: attributes.district.city.name,
                        state_id: state.id, 
                    },
                },
                create: {
                    name: attributes.district.city.name,
                    state: {
                        connect: { id: state.id }, 
                    },
                },
                update: {}, 
                select: {
                    id: true, 
                },
            });

            const district = await prisma.district.upsert({
                where: {
                    name_city_id: {
                        name: attributes.district.name,
                        city_id: city.id, 
                    },
                },
                create: {
                    name: attributes.district.name,
                    city: {
                        connect: { id: city.id }, 
                    },
                },
                update: {}, 
                select: {
                    id: true,
                },
            });
            districtIdToConnect = district.id;
        }

        if (districtIdToConnect !== undefined) {
            updateData.district = {
                connect: { id: districtIdToConnect }
            };
        }

        try {
            return prisma.address.update({
                where: {
                    id: addressId,
                    user_id: userId, 
                },
                data: updateData,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    console.error(`Endereço com ID ${addressId} para o usuário ${userId} não encontrado.`);
                    return null; 
                }
            }
            console.error('Erro ao atualizar endereço:', error);
            throw error;
        }
    }
    async deleteByIdAddress(userId: number, addressId: number): Promise<Address | null> {
        try {
            const addressToDelete = await prisma.address.findFirst({
                where: {
                    id: addressId,
                    user_id: userId,
                },
            });
    
            if (!addressToDelete) {
                console.warn(`Tentativa de deletar endereço ${addressId} pelo usuário ${userId}, mas não encontrado.`);
                return null;
            }
    
            const deletedAddress = await prisma.address.delete({
                where: {
                    id: addressId, 
                },
            });
    
            return deletedAddress; 
    
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                     console.error(`Erro P2025 durante o delete para Endereço ${addressId}. Pode ter sido excluído concorrentemente.`);
                     return null; 
                }
            }
            console.error('Erro ao deletar endereço:', error);
            throw error;
        }
    }
}