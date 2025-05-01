import { HttpError } from "../errors/HttpError";
import { RoleType } from "../generated/prisma";
import { IrolesRepository, RoleTypeAttributes } from "../repositories/RolesRepository";
import { IuserRepository } from "../repositories/UserRepository";

export class RolesService {

    constructor(
        private readonly rolesRepository: IrolesRepository,
        private readonly userRepository: IuserRepository
    ) { }

    async getUserRoles(userId: number) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const roles = await this.rolesRepository.findByUserIdRoles(userId)
        return roles
    }

    async addUserRoles(userId: number, params: RoleTypeAttributes) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const role = await this.rolesRepository.findByRoleType(params.role_type)
        const roleId = role?.id;
        if (!roleId) {
            throw new HttpError(404, "Role not found");
        }
        const existingAssignment = await this.rolesRepository.findByUserIdRoleId(userId, roleId)
        if (existingAssignment) {
            throw new HttpError(409, `User already has the role ${params.role_type}`);
        }
        const newRole = await this.rolesRepository.addUserRole(userId, roleId)
        return newRole
    }

    async updateUserRole(userId: number, roleId: number, params: RoleTypeAttributes) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const roleExists = await this.rolesRepository.findByRoleId(roleId)
        if (!roleExists) throw new HttpError(404, "Role not found");
        const role = await this.rolesRepository.findByRoleType(params.role_type)
        const newRoleId = role?.id;
        if (!newRoleId) {
            throw new HttpError(404, "New Role not found");
        }
        const existingAssignment = await this.rolesRepository.findByUserIdRoleId(userId, newRoleId)
        if (existingAssignment) {
            throw new HttpError(409, `User already has the role ${params.role_type}`);
        }
        const roleIdExistInUser = await this.rolesRepository.findByUserRoleExist(userId, roleId)
        if (!roleIdExistInUser) {
            throw new HttpError(404, `Role not found`);
        }
        const updatedRole = await this.rolesRepository.updateByUserIdRoleId(userId, roleId, newRoleId)
        return updatedRole
    }

    async deleteUserRoles(userId: number, roleId: number) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const roleExists = await this.rolesRepository.findByUserRoleExist(userId, roleId);
        if (!roleExists) throw new HttpError(404, "Role not found");
        const deletedRole = await this.rolesRepository.deletedByUserIdRoleId(userId, roleId)
        return deletedRole
    }
}