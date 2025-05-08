import { prisma } from "../../database"
import { Address, Prisma, PrismaClient } from "../../generated/prisma/client"
import { CreateAddressAttributes, FindAddressAttributes, FullAddressAttributes, IaddressRepository, UpdateAddressAttributes } from "../AddressRepository"
import { PrismaClientOrTransaction } from "../ClientTransaction"
import { addressWithFullAddressSelect } from "./utils/addressWithFullAddressSelect"

export class PrismaAddressRepository implements IaddressRepository {

    constructor(private readonly prisma: PrismaClient) { }

    async findByUserIdAddress(userId: number, client?: PrismaClientOrTransaction): Promise<FindAddressAttributes[]> {
        const prismaClient = client || this.prisma;
        return prismaClient.address.findMany({
            where: { user_id: userId },
            select: addressWithFullAddressSelect
        })
    }

    async findByUserIdAddressId(userId: number, addressId: number, client?: PrismaClientOrTransaction): Promise<FullAddressAttributes | null> {
        const prismaClient = client || this.prisma;
        return prismaClient.address.findUnique({
            where: { user_id: userId, id: addressId },
            select: {
                id: true,
                street: true,
                number: true,
                cep_street: true,
                complement: true,
                address_type: true,
                district: {
                    select: {
                        name: true,
                        city: {
                            select: {
                                name: true,
                                state: {
                                    select: {
                                        name: true,
                                        uf: true,
                                        country: {
                                            select: {
                                                name: true,
                                                acronym: true,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    async createAddress(userId: number, attributes: CreateAddressAttributes, client?: PrismaClientOrTransaction): Promise<Address> {

        const prismaClient = client || this.prisma;

        const country = await prismaClient.country.upsert({
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

        const state = await prismaClient.state.upsert({
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

        const city = await prismaClient.city.upsert({
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

        const district = await prismaClient.district.upsert({
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

        const newAddress = await prismaClient.address.create({
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

    async updateByIdAddress(userId: number, addressId: number, attributes: UpdateAddressAttributes, client?: PrismaClientOrTransaction): Promise<Address | null> {
        const prismaClient = client || this.prisma;

        const updateData: Prisma.AddressUpdateInput = {
            street: attributes.street,
            number: attributes.number,
            cep_street: attributes.cep_street,
            complement: attributes.complement,
            address_type: attributes.address_type,
        };

        let districtIdToConnect: number | undefined;

        if (attributes.district) {

            if (attributes.district.city?.state?.country?.acronym !== undefined && attributes.district.city.state.country.name !== undefined) {
                try {
                    const country = await prismaClient.country.upsert({
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

                    const countryId = country.id;

                    if (attributes.district.city.state.uf !== undefined && attributes.district.city.state.name !== undefined) {
                        try {
                            const state = await prismaClient.state.upsert({
                                where: {
                                    uf_country_id: {
                                        uf: attributes.district.city.state.uf,
                                        country_id: countryId,
                                    },
                                },
                                create: {
                                    name: attributes.district.city.state.name,
                                    uf: attributes.district.city.state.uf,
                                    country: {
                                        connect: { id: countryId },
                                    },
                                },
                                update: {
                                    name: attributes.district.city.state.name,
                                },
                                select: {
                                    id: true,
                                },
                            });
                            const stateId = state.id;

                            if (attributes.district.city.name !== undefined) {
                                try {
                                    const city = await prismaClient.city.upsert({
                                        where: {
                                            name_state_id: {
                                                name: attributes.district.city.name,
                                                state_id: stateId,
                                            },
                                        },
                                        create: {
                                            name: attributes.district.city.name,
                                            state: {
                                                connect: { id: stateId },
                                            },
                                        },
                                        update: {},
                                        select: {
                                            id: true,
                                        },
                                    });

                                    const cityId = city.id;

                                    if (attributes.district.name !== undefined) {
                                        try {
                                            const district = await prismaClient.district.upsert({
                                                where: {
                                                    name_city_id: {
                                                        name: attributes.district.name,
                                                        city_id: cityId,
                                                    },
                                                },
                                                create: {
                                                    name: attributes.district.name,
                                                    city: {
                                                        connect: { id: cityId },
                                                    },
                                                },
                                                update: {},
                                                select: {
                                                    id: true,
                                                },
                                            });

                                            districtIdToConnect = district.id;

                                        } catch (districterror) {
                                            console.error('Erro no upsert de District:', districterror);

                                            throw districterror;
                                        }
                                    } else {
                                        console.warn(`District name missing in update attributes for address ${addressId}. Cannot upsert district.`);
                                    }
                                } catch (cityerror) {
                                    console.error('Erro no upsert de City:', cityerror);
                                    throw cityerror;
                                }
                            } else {
                                console.warn(`State uf or name missing in update attributes for address ${addressId}. Cannot upsert city or district.`);
                            }
                        } catch (stateerror) {
                            console.error('Erro no upsert de State:', stateerror);
                            throw stateerror;
                        }
                    } else {
                        console.warn(`Country acronym or name missing in update attributes for address ${addressId}. Cannot upsert state, city or district.`);
                    }
                } catch (countryerror) {
                    console.error('Erro no upsert de Country:', countryerror);
                    throw countryerror;
                }
            } else {
                console.warn(`Nested country data missing or incomplete in update attributes for address ${addressId}. Cannot upsert location.`);
            }
        }

        if (districtIdToConnect !== undefined) {
            updateData.district = {
                connect: { id: districtIdToConnect }
            };
        }

        try {
            const updatedAddress = await prismaClient.address.update({
                where: {

                    id: addressId,
                    user_id: userId,
                },
                data: updateData,

                include: {
                    district: {
                        include: {
                            city: {
                                include: {
                                    state: {
                                        include: {
                                            country: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return updatedAddress;

        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    console.error(`Endereço com ID ${addressId} para o usuário ${userId} não encontrado durante update.`);
                    return null;
                }
            }
            console.error('Erro inesperado ao atualizar endereço:', error);
            throw error;
        }
    }

    async deleteByIdAddress(userId: number, addressId: number, client?: PrismaClientOrTransaction): Promise<Address | null> {
        const prismaClient = client || this.prisma;
        try {
            const addressToDelete = await prismaClient.address.findFirst({
                where: {
                    id: addressId,
                    user_id: userId,
                },
            });

            if (!addressToDelete) {
                console.warn(`Tentativa de deletar endereço ${addressId} pelo usuário ${userId}, mas não encontrado.`);
                return null;
            }

            const deletedAddress = await prismaClient.address.delete({
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