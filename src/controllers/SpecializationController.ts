import { Handler } from "express";
import { SpecializationService } from "../services/SpecializationService";
import { CreateSpecializationRequestSchema } from "./schemas/SpecializationRequestSchemas";

export class SpecializationController {
    constructor(
        private readonly specializationService: SpecializationService
    ) { }

    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const providerId = Number(req.params.providerId)
            const specializations = await this.specializationService.getProviderSpecializations(id, providerId)
            res.status(200).json(specializations);
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => { 
        try {
            const id = Number(req.params.id);
            const providerId = Number(req.params.providerId)
            const body = CreateSpecializationRequestSchema.parse(req.body)
            const addProviderSpecialization = await this.specializationService.addProviderSpecialization(id, providerId, body)
            res.status(201).json(addProviderSpecialization);
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const providerId = Number(req.params.providerId)
            const specializationId = Number(req.params.specializationId)
            const body = CreateSpecializationRequestSchema.parse(req.body)
            const updatedProviderSpecialization = await this.specializationService.updateProviderSpecialization(id, providerId, specializationId, body)
            res.status(201).json(updatedProviderSpecialization);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const providerId = Number(req.params.providerId)
            const specializationId = Number(req.params.specializationId)
            const deletedProviderSpecialization = await this.specializationService.deleteProviderSpecialization(id, providerId, specializationId)
            res.status(201).json(deletedProviderSpecialization);
        } catch (error) {
            next(error)
        }
    }
}