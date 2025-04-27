import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";
import { CreatePhoneRequestSchema, UpdatePhoneRequestSchema } from "./schemas/PhoneRequestSchemas";

export class PhoneController {
    // CREATE User/:id/phones
    create: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const body = CreatePhoneRequestSchema.parse(req.body)

            const userExists = await prisma.user.findUnique({ where: { id } })
            if (!userExists) throw new HttpError(404, "User not found");

            const newPhone = await prisma.phone.create({
                data: {
                    ...body,
                    user_id: id
                }
            })
            res.status(201).json(newPhone);
        } catch (error) {
            next(error);
        }
    }

    // UPDATE User/:id/phones/:phoneId
    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const phoneId = Number(req.params.phoneId)
            const body = UpdatePhoneRequestSchema.parse(req.body)

            const userExists = await prisma.user.findUnique({ where: { id } })
            if (!userExists) throw new HttpError(404, "User not found");

            const phoneExists = await prisma.phone.findUnique({ where: { id: phoneId } })
            if (!phoneExists) throw new HttpError(404, "Phone not found");

            const updatedPhone = await prisma.phone.update({
                data: body,
                where: { id: phoneId }
            })
            res.status(200).json(updatedPhone);
        } catch (error) {
            next(error);
        }
    }
}