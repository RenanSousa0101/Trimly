import { HttpError } from "../errors/HttpError";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { IproviderRepository } from "../repositories/ProviderRepository";
import { CreateSpecialization, IspecializationRepository } from "../repositories/SpecializationRepository";
import { IuserRepository } from "../repositories/UserRepository";

export class SpecializationService {
    
    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly userRepository: IuserRepository,
        private readonly providerRepository: IproviderRepository,
        private readonly specializationRepository: IspecializationRepository
    ) { }

    async getProviderSpecializations(userId: number, providerId: number) {
        const userExists = await this.userRepository.findById(userId);
        if (!userExists) throw new HttpError(404, "User not found");
        const providerExists = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!providerExists) throw new HttpError(404, "Provider not found");
        const getProviderSpecialization = await this.specializationRepository.findByProviderIdSpecializations(providerId);
        if (!getProviderSpecialization) throw new HttpError(404, "Specializations not found");
        return getProviderSpecialization
    }

    async addProviderSpecialization(userId: number, providerId: number, params: CreateSpecialization) {
        
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
    
        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) {
            throw new HttpError(404, "Provider not found");
        }
    
        const specializationNameLower = params.name.toLowerCase();
    
        let specialization = await this.specializationRepository.findBySpecializationName(specializationNameLower);

        const transactionProviderSpecialization = await this.prismaClient.$transaction(async (transactionClient: Prisma.TransactionClient) => {
    
            if (!specialization) {
                specialization = await this.specializationRepository.createSpecialization({
                    ...params,
                    name: specializationNameLower,
                }, transactionClient as any);
            }
        
            const findByProviderIdSpecializationId = await this.specializationRepository.findByProviderIdSpecializationId(providerId, specialization.id, transactionClient as any);
            if (findByProviderIdSpecializationId) throw new HttpError(409, "The provider already has this specialization")

            const providerSpecializationLink = await this.specializationRepository.addProviderSpecialization(providerId, specialization.id, transactionClient as any);
        
            return {
                name: user.name,
                business_name: provider.business_name,
                description: provider.description,
                specialization: providerSpecializationLink.specialization.name,
                description_specialization: providerSpecializationLink.specialization.description
            };
        })
        return transactionProviderSpecialization
    }

    async updateProviderSpecialization(userId: number, providerId: number, specializationId: number, params: CreateSpecialization) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpError(404, "User not found");
    
        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) throw new HttpError(404, "Provider not found");

        const checkSpecialization = await this.specializationRepository.findByProviderIdSpecializationId(providerId, specializationId)
        if (!checkSpecialization) throw new HttpError(404, "Specialization not found")

        const specializationNameLower = params.name.toLowerCase();
    
        let specialization = await this.specializationRepository.findBySpecializationName(specializationNameLower);

        const transactionProviderSpecialization = await this.prismaClient.$transaction(async (transactionClient: Prisma.TransactionClient) => {
    
            if (!specialization) {
                specialization = await this.specializationRepository.createSpecialization({
                    ...params,
                    name: specializationNameLower,
                }, transactionClient as any);
            }
        
            const findByProviderIdSpecializationId = await this.specializationRepository.findByProviderIdSpecializationId(providerId, specialization.id, transactionClient as any);
            if (findByProviderIdSpecializationId) throw new HttpError(409, "The provider already has this specialization")

            const providerSpecializationLink = await this.specializationRepository.updateByProviderIdEspecializationId(providerId, specializationId, specialization.id,transactionClient as any);
        
            return {
                name: user.name,
                business_name: provider.business_name,
                description: provider.description,
                specialization: providerSpecializationLink.specialization.name,
                description_specialization: providerSpecializationLink.specialization.description
            };
        })
        return transactionProviderSpecialization
    }
}