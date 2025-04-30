import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import { CreateRoleRequestSchema, UpdateRoleRequestSchema } from "./schemas/RoleRequestSchemas";
import { IrolesRepository } from "../repositories/RolesRepository";
import { IuserRepository } from "../repositories/UserRepository";

export class RolesController {

    private rolesRepository: IrolesRepository;
    private userRepository: IuserRepository;

    constructor(rolesRepository: IrolesRepository, userRepository: IuserRepository) {
        this.userRepository = userRepository
        this.rolesRepository = rolesRepository
    }

    // SHOW User/:id/roles
    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const userExists = await this.userRepository.findById(id)
            if (!userExists) throw new HttpError(404, "User not found");
            const roles = await this.rolesRepository.findByUserIdRoles(id)
            res.status(200).json(roles);
        } catch (error) {
            next(error);
        }
    }
    // CREATE User/:id/roles
    create: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const body = CreateRoleRequestSchema.parse(req.body);
            const userExists = await this.userRepository.findById(id)
            if (!userExists) throw new HttpError(404, "User not found");
            const role = await this.rolesRepository.findByRoleType(body.role_type)
            const roleId = role?.id;
            if (!roleId) {
                throw new HttpError(404, "Role not found");
            }
            const existingAssignment = await this.rolesRepository.findByUserIdRoleId(id, roleId)
            if (existingAssignment) {
                throw new HttpError(409, `User already has the role ${body.role_type}`);
            }
            const newRole = await this.rolesRepository.addUserRole(id, roleId)
            res.status(201).json(newRole);
        } catch (error) {
            next(error);
        }
    }
    // UPDATE User/:id/roles/:roleId
    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const roleId = Number(req.params.roleId);
            const body = UpdateRoleRequestSchema.parse(req.body);
            const userExists = await this.userRepository.findById(id)
            if (!userExists) throw new HttpError(404, "User not found");
            const roleExists = await this.rolesRepository.findByRoleId(roleId)
            if (!roleExists) throw new HttpError(404, "Role not found");
            const role = await this.rolesRepository.findByRoleType(body.role_type)
            const newRoleId = role?.id;
            if (!newRoleId) {
                throw new HttpError(404, "New Role not found");
            }
            const existingAssignment = await this.rolesRepository.findByUserIdRoleId(id, newRoleId)
            if (existingAssignment) {
                throw new HttpError(409, `User already has the role ${body.role_type}`);
            }
            const roleIdExistInUser = await this.rolesRepository.findByUserRoleExist(id, roleId)
            if (!roleIdExistInUser) {
                throw new HttpError(404, `Role not found`);
            }
            console.log(roleIdExistInUser)
            const updatedRole = await this.rolesRepository.updateByUserIdRoleId(id, roleId, newRoleId)
            res.status(200).json(updatedRole);
        } catch (error) {
            next(error);
        }
    }
    // DELETE User/:id/roles/:roleId
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const roleId = Number(req.params.roleId);
            const userExists = await this.userRepository.findById(id)
            if (!userExists) throw new HttpError(404, "User not found");
            const roleExists = await this.rolesRepository.findByUserRoleExist(id, roleId);
            if (!roleExists) throw new HttpError(404, "Role not found");
            const deletedRole = await this.rolesRepository.deletedByUserIdRoleId(id, roleId)
            res.status(200).json(deletedRole);
        } catch (error) {
            next(error);
        }
    }
}