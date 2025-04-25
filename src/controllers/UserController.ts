import { Handler } from "express";
import { prisma } from "../database";

export class UserController {
    index: Handler = async (req, res, next) => {
       try {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
       } catch (error) {
            next(error);
       } 
    }
}