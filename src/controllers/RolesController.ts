import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import { CreateRoleRequestSchema, UpdateRoleRequestSchema } from "./schemas/RoleRequestSchemas";
import { IrolesRepository } from "../repositories/RolesRepository";
import { IuserRepository } from "../repositories/UserRepository";
import { RolesService } from "../services/RolesService";

export class RolesController {

    constructor(
        private readonly rolesService: RolesService
    ) { }

    // SHOW User/:id/roles
    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const roles = await this.rolesService.getUserRoles(id)
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
            const newRole = await this.rolesService.addUserRoles(id, body)
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
            const updatedRole = await this.rolesService.updateUserRole(id, roleId, body)
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
            const deletedRole = await this.rolesService.deleteUserRoles(id, roleId)
            res.status(200).json(deletedRole);
        } catch (error) {
            next(error);
        }
    }
}