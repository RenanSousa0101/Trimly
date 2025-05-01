import { prisma } from "../../database";
import {Roles, RoleType, User_Roles } from "../../generated/prisma";
import {FindRoleAttributes, UserRoleFull } from "../RolesRepository";

export class PrismaRoleRepository {
    async findByRoleId(roleId: number): Promise<Roles | null> {
        return prisma.roles.findUnique({ 
            where: { id: roleId } 
        })
    }
    async findByRoleType(roleType: RoleType): Promise<Roles | null> {
        return await prisma.roles.findUnique({
            where: { role_type: roleType },      
        });
    }
    async findByUserIdRoles(userId: number): Promise<FindRoleAttributes[] | null> {
        return prisma.user_Roles.findMany({
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
    async findByUserRoleExist(userId: number, roleId: number): Promise<User_Roles | null> {
        return prisma.user_Roles.findFirst({
            where: {
                user_id: userId,
                roles_id: roleId
            }
        })
    }
    async findByUserIdRoleId(userId: number, roleId: number): Promise<User_Roles | null> {
        return prisma.user_Roles.findUnique({
            where: {
                user_id_roles_id: {
                    user_id: userId,
                    roles_id: roleId
                }
            }
        })
    }
    async addUserRole(userId: number, roleId: number): Promise<UserRoleFull> {
        return prisma.user_Roles.create({
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
    async updateByUserIdRoleId(userId: number, roleId: number, newRoleId: Partial<number>): Promise<UserRoleFull | null> {
        return await prisma.user_Roles.update({
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
    async deletedByUserIdRoleId(userId: number, roleId: number): Promise<UserRoleFull | null> {
        return await prisma.user_Roles.delete({
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