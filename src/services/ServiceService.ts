import { HttpError } from "../errors/HttpError"
import { IserviceCategoryRepository } from "../repositories/ServiceCategoryRepository"
import { AddService, CreateService, IserviceRepository, ServiceWhereParams } from "../repositories/ServiceRepository"

interface GetServiceWithPaginationParams {
    page?: number
    pageSize?: number
    name?: string
    sortBy?: "name"
    order?: "asc" | "desc"
}
export class ServiceService {

    constructor(
        private readonly serviceRepository: IserviceRepository,
        private readonly serviceCategoryRepository: IserviceCategoryRepository
    ) { }

    async getAllServicePaginated(params: GetServiceWithPaginationParams) {
        const { name, page = 1, pageSize = 10, sortBy, order } = params;

        const take = pageSize;
        const skip = (page - 1) * take;

        const where: ServiceWhereParams = {};

        if (name) {
            where.name = { contains: name, mode: "insensitive" };
        }

        const service = await this.serviceRepository.findService({ where, sortBy, order, skip, take });
        const totalService = await this.serviceRepository.countService(where);

        return {
            service,
            meta: {
                page,
                pageSize,
                total: totalService,
                totalPages: Math.ceil(totalService / pageSize)
            }
        };
    }

    async getService(serviceId: number) {
        const service = await this.serviceRepository.findByServiceId(serviceId)
        if (!service) throw new HttpError(404, "Service not found")
        return service
    }

    async createService(params: AddService) {
        const service = await this.serviceRepository.findByServiceName(params.name.toLowerCase());
        if (service) throw new HttpError(409, "This already exists");

        let toLowerCaseServiceCategoryName = params.serviceCategoryName

        if (params.serviceCategoryName) {
            toLowerCaseServiceCategoryName = toLowerCaseServiceCategoryName.toLowerCase()
        }

        const serviceCategory = await this.serviceCategoryRepository.findByServiceCategoryName(toLowerCaseServiceCategoryName);
        if (!serviceCategory) throw new HttpError(404, "Service Category not found");

        const createServiceParams = {
            name: params.name.toLowerCase(),
            description: params.description,
            service_category_id: serviceCategory.id
        }

        const createService = await this.serviceRepository.createService(createServiceParams)
        return createService
    }

    async updateService(serviceId: number, params: Partial<AddService>) {

        const service = await this.serviceRepository.findByServiceId(serviceId)
        if (!service) throw new HttpError(404, "Service  not found");

        let formatedName = params.name
        let toLowerCaseServiceCategoryName = params.serviceCategoryName
        let serviceCategory

        if (params.serviceCategoryName) {
            toLowerCaseServiceCategoryName = params.serviceCategoryName.toLowerCase()

            serviceCategory = await this.serviceCategoryRepository.findByServiceCategoryName(toLowerCaseServiceCategoryName);
            if (!serviceCategory) throw new HttpError(404, "Service Category not found");
        }

        if (params.name) {
            formatedName = params.name.toLowerCase()
            const serviceName = await this.serviceRepository.findByServiceName(formatedName);
            if (serviceName) throw new HttpError(409, "This already exists");
        }

        const createServiceParams = {
            name: formatedName,
            description: params.description,
            service_category_id: serviceCategory?.id
        }

        const updateService = await this.serviceRepository.updateService(serviceId, createServiceParams)
        return updateService
    }

    async deleteService(serviceId: number) {
        const service = await this.serviceRepository.findByServiceId(serviceId)
        if (!service) throw new HttpError(404, "Service  not found");
        const deleteService = await this.serviceRepository.deleteService(serviceId)
        return deleteService
    }
}