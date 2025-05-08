import { Provider_Specialization, Specialization } from "../generated/prisma/client";
import { PrismaClientOrTransaction } from "./ClientTransaction";

export interface CreateSpecialization {
    name: string,
    description?: string
}

export interface FullSpecialization {
    provider_id: number
    specialization_id: number
    specialization: {
        id: number
        name: string
        description?: string | null
        created_at: Date;
        updated_at: Date;
    }
}

export interface IspecializationRepository {
    findBySpecializationId: (specializationId: number, client?: PrismaClientOrTransaction) => Promise<Specialization | null>
    findBySpecializationName: (specializationName: string, client?: PrismaClientOrTransaction) => Promise<Specialization | null>
    findByProviderIdSpecializations: (providerId: number, client?: PrismaClientOrTransaction) => Promise<Specialization[] | null>
    findByProviderIdSpecializationId: (providerId: number, specializationId: number, client?: PrismaClientOrTransaction) => Promise<Provider_Specialization | null>
    createSpecialization: (attributes: CreateSpecialization, client?: PrismaClientOrTransaction) => Promise<Specialization>
    addProviderSpecialization: (providerId: number, specializationId: number, client?: PrismaClientOrTransaction) => Promise<FullSpecialization>
    updateByProviderIdEspecializationId:(providerId: number, specializationId: number, newSpecializationId: number, client?: PrismaClientOrTransaction) => Promise<FullSpecialization>
    deletedByProviderIdSpecializationId:(providerId: number, specializationId: number, client?: PrismaClientOrTransaction) => Promise<FullSpecialization>
}