import { Handler, Request, Response, NextFunction } from "express";
import { LoginUserSchema, RegisterUserSchema } from "./schemas/AuthRequestSchemas";
import { AuthService } from "../services/AuthService";
import { GetTokenRequestSchema } from "./schemas/TokenRequestSchemas";
import { GetEmail } from "./schemas/VerifyEmailSchemas";
import { GetPassword } from "./schemas/VerifyPasswordShema";

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    register: Handler = async (req, res, next) => {
        try {
            const body = RegisterUserSchema.parse(req.body);
            const newUser = await this.authService.registerUser(body);
            res.status(201).json({
                message:
                    "Usuário cadastrado com sucesso. Verifique seu email para ativar sua conta.",
                ...newUser,
                id: undefined,
                password: undefined,
            });
        } catch (error) {
            next(error);
        }
    };

    login: Handler = async (req, res, next) => {
        try {
            const body = LoginUserSchema.parse(req.body);
            const token = await this.authService.loginUser(body);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    };

    verifyEmail: Handler = async (req: Request, res: Response, next: NextFunction) => {
        try {
        const token = GetTokenRequestSchema.parse(req.query);
        const verify = await this.authService.verifyEmailUser(token.token)
        res.send(verify);
        } catch (error) {
            next(error)
        }
    }

    resendVerificationEmail: Handler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = GetEmail.parse(req.body);
            const message = await this.authService.resendVerificationEmail(email.email);
            res.status(200).json({ message });
        } catch (error) {
           next(error)
        }
    }

    forgotPassword: Handler = async (req: Request, res: Response, next: NextFunction) => {
        
        const email  = GetEmail.parse(req.body);

        try {
            const message = await this.authService.forgotPassword(email.email);
            res.status(200).json({ message });
        } catch (error) {
            next(error)
        }
    }

    resetPassword: Handler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = GetTokenRequestSchema.parse(req.query);
            const newPassword = GetPassword.parse(req.body);   
            const message = await this.authService.resetPassword(token.token, newPassword.password);
            res.status(200).json({ message });
        } catch (error) {
          next(error)
        }
    }

}
