import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";

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

            
        } catch (error) {
            next(error);
        }
    }
}