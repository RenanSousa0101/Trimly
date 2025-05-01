import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import { CreatePhoneRequestSchema, UpdatePhoneRequestSchema } from "./schemas/PhoneRequestSchemas";
import { PhoneService } from "../services/PhoneService";

export class PhoneController {
    constructor(
        private readonly phoneService: PhoneService
    ) {}
    // SHOW User/:id/phones
    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const phones = await this.phoneService.getUserPhones(id)
            res.status(200).json(phones);
        } catch (error) {
            next(error);
        }
    }
    // CREATE User/:id/phones
    create: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const body = CreatePhoneRequestSchema.parse(req.body)
            const newPhone =  await this.phoneService.createUserPhone(id, body)
            res.status(201).json(newPhone);
        } catch (error) {
            next(error);
        }
    }
    // UPDATE User/:id/phones/:phoneId
    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const phoneId = Number(req.params.phoneId)
            const body = UpdatePhoneRequestSchema.parse(req.body)
            const updatedPhone = await this.phoneService.updateUserPhone(id, phoneId, body)
            res.status(200).json(updatedPhone);
        } catch (error) {
            next(error);
        }
    }
    // DELETE User/:id/phones/:phoneId
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const phoneId = Number(req.params.phoneId);
            const userDeleted = await this.phoneService.deleteUserPhone(id, phoneId)
            res.status(200).json({message: "Phone deleted successfully", userDeleted });
        } catch (error) {
            next(error);
        }
    }
}