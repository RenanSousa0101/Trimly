import { Handler } from "express";
import { prisma } from "../database";
import { CreateUserRequestSchema, UpdateUserRequestSchema } from "./schemas/UserRequestSchemas";
import { HttpError } from "../errors/HttpError";
import { userWithFullAddressSelect } from "../../prisma/utils/user.selectors";

export class UserController {
    // SHOW ALL /users
    index: Handler = async (req, res, next) => {
       try {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
       } catch (error) {
            next(error);
       } 
    }
    // CREATE /users
    create: Handler = async (req, res, next) => {
        try {
            const body = CreateUserRequestSchema.parse(req.body);
            const newUser = await prisma.user.create({
                data: body
            });
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }
    // SHOW ONE /users/:id
    show: Handler = async (req, res, next) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(req.params.id) },
                select: userWithFullAddressSelect
            });

            if (!user) throw new HttpError(404, "User not found");

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    // UPDATE /users/:id
    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const body = UpdateUserRequestSchema.parse(req.body)

            const leadExists = await prisma.user.findUnique({ where: { id } })
            if (!leadExists) throw new HttpError(404, "User not found");

            const updatedUser = await prisma.user.update({
                data: body,
                where: { id }                                     
            })
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    // DELETE /users/:id
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)

            const userExists = await prisma.user.findUnique({ where: { id } })
            if (!userExists) throw new HttpError(404, "User not found");

            const deletedUser = await prisma.user.delete({
                where: { id }
            })

            res.status(200).json({ deletedUser })

        } catch (error) {
            next(error); 
        }
    }
}