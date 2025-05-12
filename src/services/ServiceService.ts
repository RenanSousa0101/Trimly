import { HttpError } from "../errors/HttpError";
import { PrismaClient } from "../generated/prisma";
import { IproviderRepository } from "../repositories/ProviderRepository";
import { CreateServiceCategory, CreateServiceProvicerAttributes, IserviceRepository, ServiceCategoryWhereParams } from "../repositories/ServiceRepository";
import { IuserRepository } from "../repositories/UserRepository";

interface GetServiceCategoryWithPaginationParams {
    page?: number
    pageSize?: number
    name?: string
    sortBy?: "name"
    order?: "asc" | "desc"
}
export class ServiceService {

    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly userRepository: IuserRepository,
        private readonly providerRepository: IproviderRepository,
        private readonly serviceRepository: IserviceRepository
    ) { }

    async getAllServiceCategoryPaginated(params: GetServiceCategoryWithPaginationParams) {
        const { name, page = 1, pageSize = 10, sortBy, order } = params;

        const take = pageSize;
        const skip = (page - 1) * take;

        const where: ServiceCategoryWhereParams = {};

        if (name) {
            where.name = { contains: name, mode: "insensitive" };
        }

        const serviceCategory = await this.userRepository.find({ where, sortBy, order, skip, take });
        const totalServiceCategory = await this.userRepository.count(where);

        return {
            serviceCategory,
            meta: {
                page,
                pageSize,
                total: totalServiceCategory,
                totalPages: Math.ceil(totalServiceCategory / pageSize)
            }
        };
    }

    async getServiceCategory(serviceCategoryId: number) { 
        const serviceCategory = await this.serviceRepository.findByServiceCategoryId(serviceCategoryId)
        if (!serviceCategory) throw new HttpError(404, "Service Category not found")
        return serviceCategory
    }

    async createServiceCategory(params: CreateServiceCategory) {
        const createServiceCategory = await this.serviceRepository.createServiceCategory(params)
        return createServiceCategory
    }

    async updateServiceCategory(serviceCategoryId: number, params: Partial<CreateServiceCategory>) {
        const updateServiceCategory = await this.serviceRepository.updateServiceCategory(serviceCategoryId, params)
        return updateServiceCategory
    }

    async deleteServiceCategory(serviceCategoryId: number) {
        const deleteServiceCategory = await this.serviceRepository.deleteServiceCategory(serviceCategoryId)
        return deleteServiceCategory
    }
}