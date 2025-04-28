import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";
import { CreateRoleRequestSchema } from "./schemas/RoleRequestSchemas";
import { nullable } from "zod";

export class RolesController {
    // SHOW User/:id/roles
    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const userExists = await prisma.user.findUnique({ where: { id } });
            if (!userExists) throw new HttpError(404, "User not found");

            const roles = await prisma.user_Roles.findMany({
                where: { user_id: id },
                select: {
                    roles: {
                        select: {
                            role_type: true,
                        }
                    } 
                }
            });
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

            const userExists = await prisma.user.findUnique({ where: { id } });
            if (!userExists) throw new HttpError(404, "User not found");

            const role = await prisma.roles.findUnique({
                where: { role_type: body.role_type }, // Busca DIRETO pelo tipo do body
                select: { id: true } // Pega apenas o ID
           });

            let roleId = role?.id;

            if(!roleId) {
                throw new HttpError(404, "Role not found");
            }

            const existingAssignment = await prisma.user_Roles.findUnique({
                where: {
                    user_id_roles_id: {
                        user_id: id,
                        roles_id: roleId
                    }
                }
           });

           if (existingAssignment) {
               throw new HttpError(409, `User already has the role ${body.role_type}`);
           }

            const newRole = await prisma.user_Roles.create({
                data: {
                    user_id: id,
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

            res.status(201).json(newRole);
        } catch (error) {
            next(error);
        }
    }
}