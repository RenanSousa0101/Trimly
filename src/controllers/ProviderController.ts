import { Handler } from "express";
import { CreateProviderRequestSchema } from "./schemas/ProviderRequestSchemas";
import { ProviderService } from "../services/ProviderService";

export class ProviderController {
    constructor(
        private readonly providerService: ProviderService
    ){}

    create: Handler = async (req, res, next) => {
        try {
            const userId = Number(req.params.id);
            const body = CreateProviderRequestSchema.parse(req.body);
            const createProvider = await this.providerService.createProvider(userId, body);
            res.status(201).json({message: "Provider role created successfully!", createProvider});
        } catch (error) {
           next(error) 
        }
    }
}