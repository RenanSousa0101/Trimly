import { HttpError } from "../errors/HttpError";
import { IproviderRepository } from "../repositories/ProviderRepository";
import { AddProviderServiceAttributes, IproviderServiceRepository, ProviderServiceWhereParams } from "../repositories/ProviderServiceRepository";
import { IserviceRepository } from "../repositories/ServiceRepository";
import { IuserRepository } from "../repositories/UserRepository";

interface GetProviderServiceWithPaginationParams {
    page?: number
    pageSize?: number
    name?: string
    sortBy?: "name" | "created_at" | "updated_at" | "price" | "duration"
    order?: "asc" | "desc"
}

export class ProviderServiceService {

    constructor(
        private readonly userRepository: IuserRepository,
        private readonly providerRepository: IproviderRepository,
        private readonly serviceRepository: IserviceRepository,
        private readonly providerServiceRepository: IproviderServiceRepository,
    ) { }

    async getAllProviderServicePaginated(userId: number, providerId: number, params: GetProviderServiceWithPaginationParams) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId)
        if (!provider) throw new HttpError(404, "Provider not found");
        
        const { name, page = 1, pageSize = 10, sortBy, order } = params;

        const take = pageSize;
        const skip = (page - 1) * take;

        const where: ProviderServiceWhereParams = {};

        if (name) {
            where.name = { contains: name, mode: "insensitive" };
        }

        const providerServices = await this.providerServiceRepository.findProviderServices(userId, providerId, { where, sortBy, order, skip, take });
        const totalService = await this.providerServiceRepository.countProviderService(where);

        return {
            providerServices,
            meta: {
                page,
                pageSize,
                total: totalService,
                totalPages: Math.ceil(totalService / pageSize)
            }
        };
    }

    async getProviderService(userId:number, providerId: number, providerServiceId: number) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId)
        if (!provider) throw new HttpError(404, "Provider not found");

        const providerService = await this.providerServiceRepository.findByProviderServiceId(userId, providerId, providerServiceId)
        if (!providerService) throw new HttpError(404, "Provider Service not found")
        return providerService
    }

    async createProviderService(userId: number, providerId: number, params: AddProviderServiceAttributes) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId)
        if (!provider) throw new HttpError(404, "Provider not found");

        const service = await this.serviceRepository.findByServiceName(params.nameService.toLowerCase())
        if (!service) throw new HttpError(404, "Service not found");

        const providerService = await this.providerServiceRepository.findByProviderExistServiceId(userId, providerId, service.id)
        if (providerService) throw new HttpError(409, "Provider Service already exists");

        const dateProviderService = {
            price: params.price,
            duration: params.duration
        }

        const createProviderService = await this.providerServiceRepository.createProviderService(providerId, service.id, dateProviderService)
        return createProviderService
    }

    async updateProviderService(userId: number, providerId: number, providerServiceId: number, params: Partial<AddProviderServiceAttributes>) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId)
        if (!provider) throw new HttpError(404, "Provider not found");

        const providerService = await this.providerServiceRepository.findByProviderServiceId(userId, providerId, providerServiceId)
        if (!providerService) throw new HttpError(404, "Provider Service not found");

        let toLowerCaseServiceName = params.nameService
        let newService

        if (params.nameService) {
            toLowerCaseServiceName = params.nameService.toLowerCase()

            newService = await this.serviceRepository.findByServiceName(toLowerCaseServiceName);
            if (!newService) throw new HttpError(404, "New Service not found");

            const service = await this.providerServiceRepository.findByProviderExistServiceId(userId, providerId, newService.id)
            if (service) throw new HttpError(409, "Provider Service already exists");
        }

        const formatedParams = {
            price: params?.price,
            duration: params?.duration
        }

        const updateProviderService = await this.providerServiceRepository.updateProviderService(providerId, providerServiceId,  formatedParams, newService?.id)
        return updateProviderService
    }

    async deleteProviderService(userId: number, providerId: number, providerServiceId: number) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId)
        if (!provider) throw new HttpError(404, "Provider not found");

        const providerService = await this.providerServiceRepository.findByProviderServiceId(userId, providerId, providerServiceId)
        if (!providerService) throw new HttpError(404, "Provider Service not found");

        const deleteProviderService = await this.providerServiceRepository.deleteProviderService(providerId, providerServiceId)
        return deleteProviderService
    }
}