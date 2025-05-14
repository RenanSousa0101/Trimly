import { Handler } from "express";
import { ProviderServiceService } from "../services/ProviderServiceService";
import { GetUserRequestSchema } from "./schemas/UserRequestSchemas";
import { CreateProviderServiceRequestSchema, UpdateProviderServiceRequestSchema } from "./schemas/ServiceRequestSchemas";

export class ProviderServiceController {

    constructor(private readonly providerServiceService: ProviderServiceService) { }

    index: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const providerId = Number(req.params.providerId)
            const query = GetUserRequestSchema.parse(req.query);
            const { page = "1", pageSize = "10" } = query;

            const result = await this.providerServiceService.getAllProviderServicePaginated(
                id,
                providerId,
                {
                    ...query,
                    page: +page,
                    pageSize: +pageSize,
                }
            );

            res.status(200).json({ ...result });

        } catch (error) {
            next(error);
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const providerId = Number(req.params.providerId)
            const serviceId = Number(req.params.providerServiceId)
            const getProviderService = await this.providerServiceService.getProviderService(id, providerId, serviceId)
            res.status(200).json(getProviderService)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const providerId = Number(req.params.providerId)
            const body = CreateProviderServiceRequestSchema.parse(req.body)
            const createProviderService = await this.providerServiceService.createProviderService(id, providerId, body)
            res.status(200).json(createProviderService)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => { 
        const id = Number(req.params.id)
        const providerId = Number(req.params.providerId)
        const serviceId = Number(req.params.providerServiceId)
        const body = UpdateProviderServiceRequestSchema.parse(req.body)
        const updateProviderService = await this.providerServiceService.updateProviderService(id, providerId, serviceId, body)
        res.status(200).json(updateProviderService)
    }

    delete: Handler = async (req, res, next) => { 
        const id = Number(req.params.id)
        const providerId = Number(req.params.providerId)
        const serviceId = Number(req.params.providerServiceId)
        const deleteProviderService = await this.providerServiceService.deleteProviderService(id, providerId, serviceId)
        res.status(200).json(deleteProviderService)
    }
}