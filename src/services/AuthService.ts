import { HttpError } from "../errors/HttpError";
import { IuserRepository, LoginUser, RegisterUser } from "../repositories/UserRepository";
import { IrolesRepository } from "../repositories/RolesRepository";
import { ItokenRepository } from "../repositories/TokenRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import { EmailService } from "./EmailService";
import { PasswordService } from "./PasswordService";
import { TokenType } from "../generated/prisma";


const EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS = 24;
const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;
export class AuthService {
    constructor(
        private readonly userRepository: IuserRepository,
        private readonly rolesRepository: IrolesRepository,
        private readonly tokenRepository: ItokenRepository,
        private readonly emailService: EmailService,
        private readonly passwordService: PasswordService
    ) { }

    async registerUser(params: RegisterUser) {
        const userExists = await this.userRepository.findByEmail(params.email);
        if (userExists) throw new HttpError(409, "Email already exists");

        const role = await this.rolesRepository.findByRoleType("Client");
        if (!role) throw new HttpError(404, "Role not found!");

        const newUser = await this.userRepository.register(role.id, params);

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpiresAt = new Date();

        verificationTokenExpiresAt.setHours(
            verificationTokenExpiresAt.getHours() +
            EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS
        );

        const newUserId = newUser.id
        const token = {
            token: verificationToken, 
            type: TokenType.EMAIL_VERIFICATION, 
            expiresAt: verificationTokenExpiresAt
        }

        await this.tokenRepository.createToken(newUserId, token)

        this.emailService.sendVerificationEmail(params.email, verificationToken)
            .catch(err => console.error('Erro ao enviar email de verificação após registro:', err));
        return newUser
    }

    async loginUser(params: LoginUser) {
        const user = await this.userRepository.findByEmail(params.email);
        if (!user) throw new HttpError(401, "Invalid email or password");
        const isPasswordValid = bcrypt.compareSync(params.password, user.password);
        if (!isPasswordValid) throw new HttpError(401, "Invalid email or password");
        if (user.isEmailVerified !== true) throw new HttpError(401, "Unverified email");
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_KEY!,
            { expiresIn: "1h" }
        );
        return token;
    }

    async verifyEmailUser(token: string) {
        if (!token) throw new HttpError(400, 'Token de verificação inválido.');

        const verificationToken = await this.tokenRepository.findToken(token)
        if (!verificationToken || verificationToken.type !== TokenType.EMAIL_VERIFICATION) throw new HttpError(404, 'Token de verificação não encontrado ou inválido.');

        const tokenId = verificationToken.id
        const userId = verificationToken.user_id

        if (verificationToken.user.isEmailVerified) {
            await this.tokenRepository.deleteToken(tokenId);
            return { status: 200, message: 'Email já verificado anteriormente.'}
        }

        if (verificationToken.expiresAt < new Date()) {
            await this.tokenRepository.deleteToken(tokenId);
            throw new HttpError(400, 'Token de verificação expirado. Por favor, solicite um novo link.');
        }

        await this.tokenRepository.updateTokenUser(userId);
        await this.tokenRepository.deleteToken(tokenId);

        return { status: 200, message: 'Seu email foi verificado com sucesso! Você já pode fazer login.'}
    }
}

