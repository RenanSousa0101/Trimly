import { Handler, NextFunction } from "express";
import { ServiceService } from "../services/ServiceService";
import { GetUserRequestSchema } from "./schemas/UserRequestSchemas";
import { CreateServiceCategoryRequestSchema, UpdateServiceCategoryRequestSchema } from "./schemas/ServiceRequestSchemas";

export class ServiceController {

    constructor(private readonly serviceService: ServiceService) {}

    index: Handler = async (req, res, next) => {
        try {
             const query = GetUserRequestSchema.parse(req.query);
             const { page = "1", pageSize = "10" } = query;
 
             const result = await this.serviceService.getAllServiceCategoryPaginated({
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
            const id = Number(req.params.serviceCategoryId)
            const getServiceCategory = await this.serviceService.getServiceCategory(id)
            res.status(200).json(getServiceCategory)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res , next) => {
        try {
            const body = CreateServiceCategoryRequestSchema.parse(req.body)
            const createServiceCategory = await this.serviceService.createServiceCategory(body)
            res.status(200).json(createServiceCategory)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.serviceCategoryId)
            const body = UpdateServiceCategoryRequestSchema.parse(req.body)
            const updated = await this.serviceService.updateServiceCategory(id, body)
            res.status(200).json(updated)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.serviceCategoryId)
            const deleted = await this.serviceService.deleteServiceCategory(id);
            res.status(200). json(deleted)
        } catch (error) {
            next(error)
        }
    }
}