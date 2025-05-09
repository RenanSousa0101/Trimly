import { Specialization, Provider_Specialization, PrismaClient } from "../../generated/prisma/client";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import { CreateSpecialization, FullSpecialization, IspecializationRepository } from "../SpecializationRepository";

export class PrismaSpecializationRepository implements IspecializationRepository {
    
    constructor(private readonly prisma: PrismaClient) {}

    async findBySpecializationId(specializationId: number, client?: PrismaClientOrTransaction): Promise<Specialization | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.specialization.findUnique({ 
            where: { id: specializationId } 
        })
    }

    async findBySpecializationName(specializationName: string, client?: PrismaClientOrTransaction): Promise<Specialization | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.specialization.findFirst({
            where: { name: specializationName },      
        });
    }

    async findByProviderIdSpecializations(providerId: number, client?: PrismaClientOrTransaction): Promise<Specialization[] | null> {
        const prismaClient = client || this.prisma;

        const providerSpecializations = await prismaClient.provider_Specialization.findMany({
            where: { provider_id: providerId },
            include: {
                specialization: true
            }
        })

        const specializations = providerSpecializations.map(ps => ps.specialization);
        return specializations;
    }

    async findByProviderIdSpecializationId(providerId: number, specializationId: number, client?: PrismaClientOrTransaction): Promise<Provider_Specialization | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Specialization.findUnique({
            where: {
                provider_id_specialization_id: {
                    provider_id: providerId,
                    specialization_id: specializationId
                }
            }
        })
    }

    async createSpecialization(attributes: CreateSpecialization, client?: PrismaClientOrTransaction): Promise<Specialization> {
        const prismaClient = client || this.prisma;

        return prismaClient.specialization.create({
            data: { ...attributes }
        })
    }

    async addProviderSpecialization(providerId: number, specializationId: number, client?: PrismaClientOrTransaction): Promise<FullSpecialization> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Specialization.create({
            data: {
                provider_id: providerId,
                specialization_id: specializationId 
            },
            select: {
                provider_id: true,
                specialization_id: true,
                specialization: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        created_at: true,
                        updated_at: true
                    }
                }
            }
        });
    }

    async updateByProviderIdEspecializationId(providerId: number, specializationId: number, newSpecializationId: number, client?: PrismaClientOrTransaction): Promise<FullSpecialization> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Specialization.update({
             where: {
                 provider_id_specialization_id: {
                     provider_id: providerId,
                     specialization_id: specializationId
                 }
             },
             data: {
                 specialization_id: newSpecializationId
             },
             select: {
                 provider_id: true,
                 specialization_id: true,
                 specialization: {
                     select: {
                         id: true,
                         name: true,
                         description: true, 
                         created_at: true,
                         updated_at: true
                     }
                 }
             }
         });
    }

    async deletedByProviderIdSpecializationId(providerId: number, specializationId: number, client?: PrismaClientOrTransaction): Promise<FullSpecialization> {
        const prismaClient = client || this.prisma;

        return prismaClient.provider_Specialization.delete({
            where: {
                provider_id_specialization_id: {
                    provider_id: providerId,
                    specialization_id: specializationId
                }
            },
            select: {
                provider_id: true,
                specialization_id: true,
                specialization: {
                    select: {
                        id: true,
                         name: true,
                         description: true, 
                         created_at: true,
                         updated_at: true
                    }
                }
            }
        });
    }
    
}