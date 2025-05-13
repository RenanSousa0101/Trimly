import { Handler } from "express";
import { ServiceCategoryService } from "../services/ServiceCategoryService";
import { GetUserRequestSchema } from "./schemas/UserRequestSchemas";
import { CreateServiceCategoryRequestSchema, UpdateServiceCategoryRequestSchema } from "./schemas/ServiceRequestSchemas";

export class ServiceCategoryController {

    constructor(private readonly serviceCategoryService: ServiceCategoryService) {}

    index: Handler = async (req, res, next) => {
        try {
             const query = GetUserRequestSchema.parse(req.query);
             const { page = "1", pageSize = "10" } = query;
 
             const result = await this.serviceCategoryService.getAllServiceCategoryPaginated({
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
            const getServiceCategory = await this.serviceCategoryService.getServiceCategory(id)
            res.status(200).json(getServiceCategory)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res , next) => {
        try {
            const body = CreateServiceCategoryRequestSchema.parse(req.body)
            const createServiceCategory = await this.serviceCategoryService.createServiceCategory(body)
            res.status(200).json(createServiceCategory)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.serviceCategoryId)
            const body = UpdateServiceCategoryRequestSchema.parse(req.body)
            const updated = await this.serviceCategoryService.updateServiceCategory(id, body)
            res.status(200).json(updated)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.serviceCategoryId)
            const deleted = await this.serviceCategoryService.deleteServiceCategory(id);
            res.status(200). json(deleted)
        } catch (error) {
            next(error)
        }
    }
}