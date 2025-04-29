import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";
import { LoginUserSchema, RegisterUserSchema } from "./schemas/AuthRequestSchemas";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthController {
    register: Handler = async (req, res, next) => {
        try {
            const body = RegisterUserSchema.parse(req.body);

            const userExists = await prisma.user.findUnique({ where: { email: body.email } })
            if (userExists) throw new HttpError(409, "Email already exists");

            const newUser = await prisma.user.create({
                data: {
                    ...body,
                    password: bcrypt.hashSync(body.password, 10),
                    User_Roles: {
                        create: {
                            roles_id: 7
                        }
                    }
                },
                select: {
                    name: true,
                    email: true,
                }
            });
            res.status(201).json({ ...newUser, password: undefined });
        } catch (error) {
            next(error);
        }
    }

    login: Handler = async (req, res, next) => {
        try {
            
            const body = LoginUserSchema.parse(req.body);

            const user = await prisma.user.findUnique({ where: { email: body.email } })
            if (!user) throw new HttpError(401, "Invalid email or password");

            const isPasswordValid = bcrypt.compareSync(body.password, user.password);
            if (!isPasswordValid) throw new HttpError(401, "Invalid email or password");

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!, { expiresIn: "1h" });

            res.json({ token })

        } catch (error) {
            next(error);
        }
    }
}