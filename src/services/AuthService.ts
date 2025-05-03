import { HttpError } from "../errors/HttpError";
import { IuserRepository, LoginUser, RegisterUser } from "../repositories/UserRepository";
import { IrolesRepository } from "../repositories/RolesRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import { EmailService } from "./EmailService";
import { PasswordService } from "./PasswordService";
import { TokenType } from "../generated/prisma";
import { prisma } from "../database";

const EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS = 24;
const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;
export class AuthService {
    constructor(
        private readonly userRepository: IuserRepository,
        private readonly rolesRepository: IrolesRepository,
        private readonly emailService: EmailService
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

        await prisma.verificationToken.create({
            data: {
                token: verificationToken,
                user_id: newUser.id,
                type: TokenType.EMAIL_VERIFICATION, // Define o tipo
                expiresAt: verificationTokenExpiresAt,
            }
        });

        this.emailService.sendVerificationEmail(params.email, verificationToken)
        .catch(err => console.error('Erro ao enviar email de verificação após registro:', err));
        return newUser
    }

    async loginUser(params: LoginUser) {
        const user = await this.userRepository.findByEmail(params.email);
        if (!user) throw new HttpError(401, "Invalid email or password");
        const isPasswordValid = bcrypt.compareSync(params.password, user.password);
        if (!isPasswordValid) throw new HttpError(401, "Invalid email or password");
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_KEY!,
            { expiresIn: "1h" }
        );
        return token;
    }
}

