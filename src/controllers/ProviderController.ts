import { Handler } from "express";
import { CreateProviderRequestSchema, GetProviderRequestSchema, UpdateProviderRequestSchema } from "./schemas/ProviderRequestSchemas";
import { ProviderService } from "../services/ProviderService";

export class ProviderController {
    constructor(
        private readonly providerService: ProviderService
    ) { }

    index: Handler = async (req, res, next) => {
        try {
            const query = GetProviderRequestSchema.parse(req.query);
            const { page = "1", pageSize = "10" } = query;

            const result = await this.providerService.getAllProvidersPaginated({
                ...query,
                page: +page,
                pageSize: +pageSize,
            });

            res.status(200).json({ ...result });
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const userId = Number(req.params.id);
            const providerId = Number(req.params.providerId)
            const findByIdProvider = await this.providerService.findProvider(userId, providerId)
            res.status(200).json({...findByIdProvider})
        } catch (error) {
            next(error)
        } 
    }

    create: Handler = async (req, res, next) => {
        try {
            const userId = Number(req.params.id);
            const body = CreateProviderRequestSchema.parse(req.body);
            const createProvider = await this.providerService.createProvider(userId, body);
            res.status(201).json({ message: "Provider role created successfully!", createProvider });
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const userId = Number(req.params.id);
            const providerId = Number(req.params.providerId);
            const body = UpdateProviderRequestSchema.parse(req.body);
            const updatedProvider = await this.providerService.updateProvider(userId, providerId, body);
            res.status(201).json({ message: "Provider updated successfully!", updatedProvider });
        } catch (error) {
            next(error)
        }
    }
}