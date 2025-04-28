import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";
import { CreateAddressRequestSchema } from "./schemas/AddressRequestSchemas";

export class AddressController {
    // SHOW User/:id/addresses
    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            const userExists = await prisma.user.findUnique({ where: { id } });
            if (!userExists) throw new HttpError(404, "User not found");

            const addresses = await prisma.address.findMany({
                where: { user_id: id },
                select: {
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
                                        },
                                    },
                                },
                            },
                        },
                    }
                }
            });
            const formattedAddresses = addresses.map((address) => ({
                type: address.address_type,
                country: address.district.city.state.country.name,
                acronym: address.district.city.state.country.acronym,
                state: address.district.city.state.name, 
                uf: address.district.city.state.uf,
                district: address.district.name, 
                city: address.district.city.name,
                street: address.street, 
                number: address.number, 
                cep: address.cep_street, 
                complement: address.complement,
            }));
            res.status(200).json(formattedAddresses);
        } catch (error) {
            next(error);
        }
    }

    // CREATE User/:id/addresses
    create: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            const userExists = await prisma.user.findUnique({ where: { id } });
            if (!userExists) throw new HttpError(404, "User not found");

            const body = CreateAddressRequestSchema.parse(req.body);

            const newAddress = await prisma.address.create({
                data: {
                    street: body.street,
                    number: body.number,
                    cep_street: body.cep_street,
                    complement: body.complement || null,
                    address_type: body.address_type,
    
                    user: {
                        connect: { id } 
                    },
    
                    district: { 
                        create: {
                            name: body.district.name, 
    
                            city: { 
                                create: { 
                                    name: body.district.city.name,
                                    
                                    state: { 
                                        create: { 
                                            name: body.district.city.state.name, 
                                            uf: body.district.city.state.uf,
    
                                            country: { 
                                                create: { 
                                                    name: body.district.city.state.country.name, 
                                                    acronym: body.district.city.state.country.acronym,
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            res.status(201).json(newAddress);
        } catch (error) {
            next(error);
        }
    }
}