import { HttpError } from "../errors/HttpError";
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
        const userRole = await this.rolesRepository.findByUserIdRoles(userId)
        if (!userRole) throw new HttpError(404, "User not Role");
        const userAdmin = userRole.find(element => {
            if (element.roles.role_type === "Admin") {return true} else {return false}
        });
        let role 
        if (userAdmin){
            role = await this.rolesRepository.findByRoleType(params.role_type)
        } else if (params.role_type !== "Admin"){
            role = await this.rolesRepository.findByRoleType(params.role_type)
        } else {
            throw new HttpError(403, "permission denied!");
        }
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
        if (roleExists.role_type === "Client") throw new HttpError(403, "Unable to change client role!")
        const userRole = await this.rolesRepository.findByUserIdRoles(userId)
        if (!userRole) throw new HttpError(404, "User not Role");
        const userAdmin = userRole.find(element => {
            if (element.roles.role_type === "Admin") {return true} else {return false}
        });
        let role 
        if (userAdmin){
            role = await this.rolesRepository.findByRoleType(params.role_type)
        } else if (params.role_type !== "Admin"){
            role = await this.rolesRepository.findByRoleType(params.role_type)
        } else {
            throw new HttpError(403, "permission denied!");
        }
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
        const roleExistsName = await this.rolesRepository.findByRoleId(roleId)
        if (roleExistsName?.role_type !== "Client") {
            const deletedRole = await this.rolesRepository.deletedByUserIdRoleId(userId, roleId)
            return deletedRole
        } else{
            throw new HttpError(403, "Unable to delete client role!")
        }
    }
}