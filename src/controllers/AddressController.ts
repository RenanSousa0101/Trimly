import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import { CreateAddressRequestSchema } from "./schemas/AddressRequestSchemas";
import { IuserRepository } from "../repositories/UserRepository";
import { IaddressRepository } from "../repositories/AddressRepository";

export class AddressController {

    private addressRepository: IaddressRepository;
    private userRepository: IuserRepository;

    constructor(addressRepository: IaddressRepository, userRepository: IuserRepository) {
        this.userRepository = userRepository
        this.addressRepository = addressRepository
    }

    // SHOW User/:id/addresses
    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const userExists = await this.userRepository.findById(id);
            if (!userExists) throw new HttpError(404, "User not found");
            const addresses = await this.addressRepository.findByUserIdAddress(id);
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
            const userExists = await this.userRepository.findById(id);
            if (!userExists) throw new HttpError(404, "User not found");
            const body = CreateAddressRequestSchema.parse(req.body);
            const newAddress = await this.addressRepository.createAddress(id, body);
            res.status(201).json(newAddress);
        } catch (error) {
            next(error);
        }
    }
    // UPDATE User/:id/addresses/:addressId
    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const addressId = Number(req.params.addressId);
            const userExists = await this.userRepository.findById(id);
            if (!userExists) throw new HttpError(404, "User not found");
            const addressExists = await this.addressRepository.findByUserIdAddressId(id, addressId);
            if (!addressExists) throw new HttpError(404, "Address not found");
            const body = CreateAddressRequestSchema.parse(req.body);
            const updatedAddress = await this.addressRepository.updateByIdAddress(id, addressId, body);
            res.status(200).json({ message: "Address updated successfully" });
        } catch (error) {
            next(error);
        }
    }
    // DELETE User/:id/addresses/:addressId
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const addressId = Number(req.params.addressId);
            const userExists = await this.userRepository.findById(id);
            if (!userExists) throw new HttpError(404, "User not found");
            const addressExists = await this.addressRepository.findByUserIdAddressId(id, addressId);
            if (!addressExists) throw new HttpError(404, "Address not found");
            const deletedAddress = await this.addressRepository.deleteByIdAddress(id, addressId);
            res.status(200).json({ message: "Address deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}