import { HttpError } from "../errors/HttpError";
import { PrismaClient } from "../generated/prisma";
import { IproviderRepository } from "../repositories/ProviderRepository";
import { CreateServiceCategory, IserviceCategoryRepository, ServiceCategoryWhereParams } from "../repositories/ServiceCategoryRepository";
import { IuserRepository } from "../repositories/UserRepository";

interface GetServiceCategoryWithPaginationParams {
    page?: number
    pageSize?: number
    name?: string
    sortBy?: "name"
    order?: "asc" | "desc"
}
export class ServiceCategoryService {

    constructor(
        private readonly serviceCategoryRepository: IserviceCategoryRepository
    ) { }

    async getAllServiceCategoryPaginated(params: GetServiceCategoryWithPaginationParams) {
        const { name, page = 1, pageSize = 10, sortBy, order } = params;

        const take = pageSize;
        const skip = (page - 1) * take;

        const where: ServiceCategoryWhereParams = {};

        if (name) {
            where.name = { contains: name, mode: "insensitive" };
        }

        const serviceCategory = await this.serviceCategoryRepository.findServiceCategory({ where, sortBy, order, skip, take });
        const totalServiceCategory = await this.serviceCategoryRepository.countServiceCategory(where);

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
        const serviceCategory = await this.serviceCategoryRepository.findByServiceCategoryId(serviceCategoryId)
        if (!serviceCategory) throw new HttpError(404, "Service Category not found")
        return serviceCategory
    }

    async createServiceCategory(params: CreateServiceCategory) {
        const serviceCategory = await this.serviceCategoryRepository.findByServiceCategoryName(params.name.toLowerCase());
        if(serviceCategory) throw new HttpError(409, "This category already exists");
        const createServiceCategory = await this.serviceCategoryRepository.createServiceCategory({...params, name: params.name.toLowerCase()})
        return createServiceCategory
    }

    async updateServiceCategory(serviceCategoryId: number, params: Partial<CreateServiceCategory>) {

        const serviceCategory = await this.serviceCategoryRepository.findByServiceCategoryId(serviceCategoryId)
        if (!serviceCategory) throw new HttpError(404, "Service Category not found");

        let formatedName = params.name

        if(params.name){
            formatedName = params.name.toLowerCase()
            const serviceCategoryName = await this.serviceCategoryRepository.findByServiceCategoryName(formatedName);
            if(serviceCategoryName) throw new HttpError(409, "This category already exists");
        }

        const updateServiceCategory = await this.serviceCategoryRepository.updateServiceCategory(serviceCategoryId, {...params, name: formatedName})
        return updateServiceCategory
    }

    async deleteServiceCategory(serviceCategoryId: number) {
        const serviceCategory = await this.serviceCategoryRepository.findByServiceCategoryId(serviceCategoryId)
        if (!serviceCategory) throw new HttpError(404, "Service Category not found");
        const deleteServiceCategory = await this.serviceCategoryRepository.deleteServiceCategory(serviceCategoryId)
        return deleteServiceCategory
    }
}