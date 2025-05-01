import { Handler } from "express";
import { CreateAddressRequestSchema } from "./schemas/AddressRequestSchemas";
import { AddressService } from "../services/AddressService";

export class AddressController {

    constructor(
        private readonly addressService: AddressService
    ) { }

    // SHOW User/:id/addresses
    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const addresses = await this.addressService.getUserAddress(id)
            res.status(200).json(addresses);
        } catch (error) {
            next(error);
        }
    }
    // CREATE User/:id/addresses
    create: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const body = CreateAddressRequestSchema.parse(req.body);
            const address = await this.addressService.createUserAddress(id, body)
            res.status(201).json(address);
        } catch (error) {
            next(error);
        }
    }
    // UPDATE User/:id/addresses/:addressId
    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const addressId = Number(req.params.addressId);
            const body = CreateAddressRequestSchema.parse(req.body);
            const updatedAddress = await this.addressService.updateUserAddress(id, addressId, body)
            res.status(200).json({ message: "Address updated successfully", updatedAddress });
        } catch (error) {
            next(error);
        }
    }
    // DELETE User/:id/addresses/:addressId
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const addressId = Number(req.params.addressId);
            const deletedAddress = await this.addressService.deleteUserAddress(id, addressId)
            res.status(200).json({ message: "Address deleted successfully", deletedAddress });
        } catch (error) {
            next(error);
        }
    }
}