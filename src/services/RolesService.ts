import { HttpError } from "../errors/HttpError";
import { IrolesRepository, RoleTypeAttributes } from "../repositories/RolesRepository";
import { IuserRepository } from "../repositories/UserRepository";

export class RolesService {

    constructor(
        private readonly rolesRepository: IrolesRepository,
        private readonly userRepository: IuserRepository
    ) { }

    async getUserRoles(userId: number) {
        const userExists = await this.userRepository.findById(userId);
        if (!userExists) {
            throw new HttpError(404, "User not found");
        }

        const roles = await this.rolesRepository.findByUserIdRoles(userId);

        return roles;
    }

    async addUserRoles(actingUserId: number, userId: number, params: RoleTypeAttributes) {
        const actingUserRoles = await this.rolesRepository.findByUserIdRoles(actingUserId);

        const safeActingUserRoles = actingUserRoles || [];

        const actingUserIsAdmin = safeActingUserRoles.some(assignment => assignment.roles.role_type === "Admin");
        const actingUserIsClient = safeActingUserRoles.some(assignment => assignment.roles.role_type === "Client");

        let canAddRole = false;

        if (actingUserIsAdmin) {
            canAddRole = true;
        }else if (actingUserId === userId && actingUserIsClient && params.role_type === "Provider") {
            canAddRole = true;
        }

        if (!canAddRole) {
            if (actingUserId !== userId) {
                throw new HttpError(403, "Permission denied. You can only add roles to yourself if you are a Client adding the Provider role.");
            } else if (params.role_type !== "Provider") {
                throw new HttpError(403, "Permission denied. You can only add the Provider role to yourself as a Client.");
            } else {
                throw new HttpError(403, "Permission denied.");
            }
        }

        const userExists = await this.userRepository.findById(userId);
        if (!userExists) {
            throw new HttpError(404, "Target user not found");
        }

        const roleToAdd = await this.rolesRepository.findByRoleType(params.role_type);
        if (!roleToAdd) {
            throw new HttpError(404, `Role type "${params.role_type}" not found.`);
        }

        const roleIdToAdd = roleToAdd.id;

        const existingAssignment = await this.rolesRepository.findByUserIdRoleId(userId, roleIdToAdd);
        if (existingAssignment) {
            throw new HttpError(409, `User already has the role "${params.role_type}"`);
        }

        const newAssignment = await this.rolesRepository.addUserRole(userId, roleIdToAdd);

        return newAssignment;
    }

    async updateUserRole(actingUserId: number, userId: number, oldRoleId: number, params: RoleTypeAttributes) {
        const actingUserRoles = await this.rolesRepository.findByUserIdRoles(actingUserId);

        const safeActingUserRoles = actingUserRoles || [];


        const actingUserIsAdmin = safeActingUserRoles.some(assignment => assignment.roles.role_type === "Admin");

        if (!actingUserIsAdmin) {
            throw new HttpError(403, "Permission denied. Only Admin users can update roles.");
        }

        const userExists = await this.userRepository.findById(userId);
        if (!userExists) {
            throw new HttpError(404, "Target user not found");
        }

        const oldRoleAssignment = await this.rolesRepository.findByUserRoleExist(userId, oldRoleId);
        if (!oldRoleAssignment) {
            throw new HttpError(404, `Old role with ID ${oldRoleId} not found for this user.`);
        }

        const oldRoleDetails = await this.rolesRepository.findByRoleId(oldRoleId);
        if (!oldRoleDetails) {
            throw new HttpError(404, `Old role with ID ${oldRoleId} details not found.`);
        }
        if (oldRoleDetails.role_type === "Client") {
            throw new HttpError(403, "Unable to change the 'Client' role assignment.");
        }

        const newRole = await this.rolesRepository.findByRoleType(params.role_type);
        if (!newRole) {
            throw new HttpError(404, `New role type "${params.role_type}" not found.`);
        }
        const newRoleId = newRole.id;

        const existingNewAssignment = await this.rolesRepository.findByUserIdRoleId(userId, newRoleId);
        if (existingNewAssignment) {
            throw new HttpError(409, `User already has the role "${params.role_type}". Cannot update to the same role.`);
        }

        const updatedAssignment = await this.rolesRepository.updateByUserIdRoleId(userId, oldRoleId, newRoleId);

        return updatedAssignment;
    }

    async deleteUserRoles(actingUserId: number, userId: number, roleId: number) {
        const actingUserRoles = await this.rolesRepository.findByUserIdRoles(actingUserId);

        const safeActingUserRoles = actingUserRoles || [];

        const actingUserIsAdmin = safeActingUserRoles.some(assignment => assignment.roles.role_type === "Admin");

        if (!actingUserIsAdmin) {
            throw new HttpError(403, "Permission denied. Only Admin users can delete roles.");
        }

        const userExists = await this.userRepository.findById(userId);
        if (!userExists) {
            throw new HttpError(404, "Target user not found");
        }

        const roleAssignmentToDelete = await this.rolesRepository.findByUserRoleExist(userId, roleId);
        if (!roleAssignmentToDelete) {
            throw new HttpError(404, `Role with ID ${roleId} not found for this user.`);
        }

        const roleDetails = await this.rolesRepository.findByRoleId(roleId);
        if (!roleDetails) {

            throw new HttpError(404, `Role with ID ${roleId} details not found.`);
        }

        if (roleDetails.role_type === "Client") {
            throw new HttpError(403, "Unable to delete the 'Client' role assignment.");
        }

        const deletedAssignment = await this.rolesRepository.deletedByUserIdRoleId(userId, roleId);

        return deletedAssignment;
    }
}