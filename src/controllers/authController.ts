import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import { LoginUserSchema, RegisterUserSchema } from "./schemas/AuthRequestSchemas";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IuserRepository } from "../repositories/UserRepository";

export class AuthController {

    private userRepository: IuserRepository;

    constructor(userRepository: IuserRepository) {
        this.userRepository = userRepository
    }


    register: Handler = async (req, res, next) => {
        try {
            const body = RegisterUserSchema.parse(req.body);
            const userExists = await this.userRepository.findByEmail(body.email)
            if (userExists) throw new HttpError(409, "Email already exists");
            const newUser = await this.userRepository.register(body)
            res.status(201).json({ ...newUser, password: undefined });
        } catch (error) {
            next(error);
        }
    }

    login: Handler = async (req, res, next) => {
        try {
            const body = LoginUserSchema.parse(req.body);
            const user = await this.userRepository.findByEmail(body.email)
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