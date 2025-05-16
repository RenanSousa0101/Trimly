import { Client, PrismaClient } from "../../generated/prisma/client";
import { ClientWhereParams, CreateClientAttributes, FindClientParams, IclientRepository } from "../ClientRepository";
import { PrismaClientOrTransaction } from "../ClientTransaction";

export class PrismaClientRepository implements IclientRepository {

    constructor(private readonly prisma: PrismaClient) { }

    findClients(params: FindClientParams, client?: PrismaClientOrTransaction): Promise<Client[]> {
        const prismaClient = client || this.prisma;

        return prismaClient.client.findMany({
            where: {
                cpf: params.where?.cpf
            },
            orderBy: { [params.sortBy ?? "cpf"]: params.order || "asc" },
            skip: params.skip,
            take: params.take,
            select: {
                id: true,
                user_id: true,
                phone_id: true,
                address_id: true,
                cpf: true,
                communication_preference: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            }
        })
    }

    findByIdClient(userId: number, clientId: number, client?: PrismaClientOrTransaction): Promise<Client | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.client.findUnique({
            where: {user_id: userId, id: clientId}
        })
    }

    findGlobalByClientId(clientId: number, client?: PrismaClientOrTransaction): Promise<Client | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.client.findUnique({
            where: {id: clientId}
        })
    }

    createClient(userId: number, addressId: number, phoneId: number, attributes: CreateClientAttributes, client?: PrismaClientOrTransaction): Promise<Client> {
        const prismaClient = client || this.prisma;

        return prismaClient.client.create({
            data: {
                ...attributes,
                user_id: userId,
                phone_id: phoneId,
                address_id: addressId
            },
        })
    }

    countClient(where: ClientWhereParams, client?: PrismaClientOrTransaction): Promise<number> {
        const prismaClient = client || this.prisma;

        return prismaClient.client.count({
            where: {
                cpf: where?.cpf
            }
        })
    }

    updateClient(userId: number, clientId: number, attributes: Partial<CreateClientAttributes>, client?: PrismaClientOrTransaction): Promise<Client> {
        const prismaClient = client || this.prisma;

        return prismaClient.client.update({
            where: {user_id: userId, id: clientId},
            data: {
                ...attributes
            }
        })
    }

    deleteClient(userId: number, clientId: number, client?: PrismaClientOrTransaction): Promise<Client> {
        const prismaClient = client || this.prisma;

        return prismaClient.client.delete({
            where: {user_id: userId, id: clientId}
        })
    }
}