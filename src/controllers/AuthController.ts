import { Handler } from "express";
import { LoginUserSchema, RegisterUserSchema } from "./schemas/AuthRequestSchemas";
import { AuthService } from "../services/AuthService";

export class AuthController {

    constructor(private readonly authService: AuthService) {}

    register: Handler = async (req, res, next) => {
        try {
            const body = RegisterUserSchema.parse(req.body);
            const newUser = await this.authService.registerUser(body)
            res.status(201).json({ ...newUser, password: undefined });
        } catch (error) {
            next(error);
        }
    }

    login: Handler = async (req, res, next) => {
        try {
            const body = LoginUserSchema.parse(req.body);
            const token = await this.authService.loginUser(body)
            res.json({ token })
        } catch (error) {
            next(error);
        }
    }
}