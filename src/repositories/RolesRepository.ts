import { Roles, RoleType, User_Roles } from "../generated/prisma";
import { PrismaClientOrTransaction } from "./ClientTransaction";

export interface FindRoleAttributes {
    roles: {
        role_type: RoleType
    }
}[]

export interface UserRoleFull {
    user_id: number,
    roles_id: number,
    roles: {
        role_type: RoleType,
    }
}

export interface RoleTypeAttributes {
    role_type: "Client" | "Provider" | "Admin";
}

export interface IrolesRepository {
    findByRoleId:(roleId: number, client?: PrismaClientOrTransaction) => Promise<Roles | null>
    findByRoleType:(roleType: RoleType, client?: PrismaClientOrTransaction) => Promise<Roles | null> 
    findByUserIdRoles:(userId: number, client?: PrismaClientOrTransaction) => Promise<FindRoleAttributes[] | null>
    findByUserRoleExist:(userId: number, roleId: number, client?: PrismaClientOrTransaction) => Promise<User_Roles | null> 
    findByUserIdRoleId:(userId: number, roleId: number, client?: PrismaClientOrTransaction) => Promise<User_Roles | null>
    addUserRole:(userId: number, roleId: number, client?: PrismaClientOrTransaction) => Promise<UserRoleFull>
    updateByUserIdRoleId:(userId: number, roleId: number, newRoleId: Partial<number>, client?: PrismaClientOrTransaction) => Promise<UserRoleFull | null>
    deletedByUserIdRoleId:(userId: number, roleId: number, client?: PrismaClientOrTransaction) => Promise<UserRoleFull | null>
}
