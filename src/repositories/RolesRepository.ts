import { Roles, RoleType, User_Roles } from "../generated/prisma";

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
    findByRoleId(roleId: number): Promise<Roles | null>
    findByRoleType(roleType: RoleType): Promise<Roles | null> 
    findByUserIdRoles(userId: number): Promise<FindRoleAttributes[]>
    findByUserRoleExist(userId: number, roleId: number): Promise<User_Roles | null> 
    findByUserIdRoleId(userId: number, roleId: number): Promise<User_Roles | null>
    addUserRole(userId: number, roleId: number): Promise<UserRoleFull>
    updateByUserIdRoleId(userId: number, roleId: number, newRoleId: Partial<number>): Promise<UserRoleFull | null>
    deletedByUserIdRoleId(userId: number, roleId: number): Promise<UserRoleFull | null>
}
