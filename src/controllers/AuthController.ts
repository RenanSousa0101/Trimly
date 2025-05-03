import { Handler, Request, Response, NextFunction } from "express";
import { LoginUserSchema, RegisterUserSchema } from "./schemas/AuthRequestSchemas";
import { AuthService } from "../services/AuthService";
import { prisma } from "../database";
import { TokenType } from "../generated/prisma";
import { HttpError } from "../errors/HttpError";

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
        const { token } = req.query; // O token vem como query parameter

        if (!token || typeof token !== 'string') throw new HttpError(400, 'Token de verificação inválido.'); 
           
        try {
            // 1. Buscar o token na tabela VerificationToken E verificar o tipo
            const verificationToken = await prisma.verificationToken.findUnique({
                where: { token: token },
                include: { user: true } // Incluir os dados do usuário relacionado
            });

            // 2. Verificar se o token existe E se é do tipo EMAIL_VERIFICATION
            if (!verificationToken || verificationToken.type !== TokenType.EMAIL_VERIFICATION) throw new HttpError(404, 'Token de verificação não encontrado ou inválido.');

            // 3. Verificar se o token expirou
            if (verificationToken.expiresAt < new Date()) {
                // Deletar token expirado (opcional, pode ser limpo por um job)
                await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
                throw new HttpError(400, 'Token de verificação expirado. Por favor, solicite um novo link.');
            }

            // 4. Verificar se o email já foi verificado (usuário vindo da relação)
            if (verificationToken.user.isEmailVerified) {
                // Deletar o token após uso (mesmo que já verificado)
                await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
                throw new HttpError(200, 'Email já verificado anteriormente.');
            }

            // 5. Marcar email como verificado na tabela User
            await prisma.user.update({
                where: { id: verificationToken.user_id }, // Atualiza pelo ID do usuário
                data: { isEmailVerified: true },
            });

            // 6. Deletar o token da tabela VerificationToken (uso único)
            await prisma.verificationToken.delete({ where: { id: verificationToken.id } });

            // 7. Redirecionar para uma página de sucesso ou login
            res.send('Seu email foi verificado com sucesso! Você já pode fazer login.'); // Ou res.redirect('/login');

        } catch (error) {
            console.error('Erro na verificação de email:', error);
            res.status(500).send('Ocorreu um erro interno ao verificar seu email.'); // Ou redirecionar
        }
    }
}
