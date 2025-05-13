import { Handler } from "express";
import { GetUserRequestSchema } from "./schemas/UserRequestSchemas";
import { CreateServiceRequestSchema, UpdateServiceRequestSchema } from "./schemas/ServiceRequestSchemas";
import { ServiceService } from "../services/ServiceService";

export class ServiceController {

    constructor(private readonly serviceService: ServiceService) {}

    index: Handler = async (req, res, next) => {
        try {
             const query = GetUserRequestSchema.parse(req.query);
             const { page = "1", pageSize = "10" } = query;
 
             const result = await this.serviceService.getAllServicePaginated({
                 ...query,
                 page: +page,
                 pageSize: +pageSize,
             });
 
             res.status(200).json({...result});
 
        } catch (error) {
             next(error);
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.serviceId)
            const getService = await this.serviceService.getService(id)
            res.status(200).json(getService)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res , next) => {
        try {
            const body = CreateServiceRequestSchema.parse(req.body)
            const createService = await this.serviceService.createService(body)
            res.status(200).json(createService)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.serviceId)
            const body = UpdateServiceRequestSchema.parse(req.body)
            const updated = await this.serviceService.updateService(id, body)
            res.status(200).json(updated)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.serviceId)
            const deleted = await this.serviceService.deleteService(id);
            res.status(200). json(deleted)
        } catch (error) {
            next(error)
        }
    }
}