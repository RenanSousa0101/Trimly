import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import { CreatePhoneRequestSchema, UpdatePhoneRequestSchema } from "./schemas/PhoneRequestSchemas";
import { IphoneRepository } from "../repositories/PhoneRepository";
import { IuserRepository } from "../repositories/UserRepository";

export class PhoneController {
    private phoneRepository: IphoneRepository;
    private userRepository: IuserRepository;
    
    constructor(phoneRepository: IphoneRepository, userRepository: IuserRepository) {
        this.userRepository = userRepository
        this.phoneRepository = phoneRepository
    }
    // SHOW User/:id/phones
    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const userExists = await this.userRepository.findById(id)
            if (!userExists) throw new HttpError(404, "User not found");
            const phones = await this.phoneRepository.findByUserIdPhone(id)
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
            const userExists = await this.userRepository.findById(id)
            if (!userExists) throw new HttpError(404, "User not found");
            const newPhone = await this.phoneRepository.createPhone(id, body)
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
            const userExists = await this.userRepository.findById(id)
            if (!userExists) throw new HttpError(404, "User not found");
            const phoneExists = await this.phoneRepository.findByUserIdPhoneId(id, phoneId)
            if (!phoneExists) throw new HttpError(404, "Phone not found");
            const updatedPhone = await this.phoneRepository.updateByIdPhone(id, phoneId, body)
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
            const userExists = await this.userRepository.findById(id);
            const phoneExists = await this.phoneRepository.findByUserIdPhoneId(id, phoneId);
            if (!userExists) throw new HttpError(404, "User not found");
            if (!phoneExists) throw new HttpError(404, "Phone not found");
            const userDeleted = await this.phoneRepository.deleteByIdPhone(id, phoneId);
            res.status(200).json({message: "Phone deleted successfully", userDeleted });
        } catch (error) {
            next(error);
        }
    }
}