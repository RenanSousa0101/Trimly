import { prisma } from "../../database";
import { PrismaClient, Roles, RoleType, User_Roles } from "../../generated/prisma/client";
import { PrismaClientOrTransaction } from "../ClientTransaction";
import {FindRoleAttributes, IrolesRepository, UserRoleFull } from "../RolesRepository";

export class PrismaRoleRepository implements IrolesRepository {

    constructor(private readonly prisma: PrismaClient) {}

    async findByRoleId(roleId: number, client?: PrismaClientOrTransaction): Promise<Roles | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.roles.findUnique({ 
            where: { id: roleId } 
        })
    }
    async findByRoleType(roleType: RoleType, client?: PrismaClientOrTransaction): Promise<Roles | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.roles.findUnique({
            where: { role_type: roleType },      
        });
    }
    async findByUserIdRoles(userId: number, client?: PrismaClientOrTransaction): Promise<FindRoleAttributes[] | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.user_Roles.findMany({
            where: { user_id: userId },
            select: {
                roles: {
                    select: {
                        role_type: true,
                    }
                } 
            }
        })
    }
    async findByUserRoleExist(userId: number, roleId: number, client?: PrismaClientOrTransaction): Promise<User_Roles | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.user_Roles.findFirst({
            where: {
                user_id: userId,
                roles_id: roleId
            }
        })
    }
    async findByUserIdRoleId(userId: number, roleId: number, client?: PrismaClientOrTransaction): Promise<User_Roles | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.user_Roles.findUnique({
            where: {
                user_id_roles_id: {
                    user_id: userId,
                    roles_id: roleId
                }
            }
        })
    }
    async addUserRole(userId: number, roleId: number, client?: PrismaClientOrTransaction): Promise<UserRoleFull> {
        const prismaClient = client || this.prisma;

        return prismaClient.user_Roles.create({
            data: {
                user_id: userId,
                roles_id: roleId 
            },
            select: {
                user_id: true,
                roles_id: true,
                roles: {
                    select: {
                        role_type: true,
                    }
                }
            }
        });
    }
    async updateByUserIdRoleId(userId: number, roleId: number, newRoleId: Partial<number>, client?: PrismaClientOrTransaction): Promise<UserRoleFull | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.user_Roles.update({
             where: {
                 user_id_roles_id: {
                     user_id: userId,
                     roles_id: roleId
                 }
             },
             data: {
                 roles_id: newRoleId
             },
             select: {
                 user_id: true,
                 roles_id: true,
                 roles: {
                     select: {
                         role_type: true,
                     }
                 }
             }
         });
    }
    async deletedByUserIdRoleId(userId: number, roleId: number, client?: PrismaClientOrTransaction): Promise<UserRoleFull | null> {
        const prismaClient = client || this.prisma;

        return prismaClient.user_Roles.delete({
            where: {
                user_id_roles_id: {
                    user_id: userId,
                    roles_id: roleId
                }
            },
            select: {
                user_id: true,
                roles_id: true,
                roles: {
                    select: {
                        role_type: true,
                    }
                }
            }
        });
    }
}