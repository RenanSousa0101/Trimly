import { HttpError } from "../errors/HttpError";
import { IuserRepository, LoginUser, RegisterUser } from "../repositories/UserRepository";
import { IrolesRepository } from "../repositories/RolesRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthService {

    constructor(
        private readonly userRepository: IuserRepository,
        private readonly rolesRepository: IrolesRepository
    ) { }

    async registerUser(params: RegisterUser) {
        const userExists = await this.userRepository.findByEmail(params.email)
        if (userExists) throw new HttpError(409, "Email already exists");
        const role = await this.rolesRepository.findByRoleType("Client")
        if(!role) throw new HttpError(404, "Role not found!")
        const newUser = await this.userRepository.register(role.id, params)
        return newUser
    }

    async loginUser(params: LoginUser) {
        const user = await this.userRepository.findByEmail(params.email)
        if (!user) throw new HttpError(401, "Invalid email or password");
        const isPasswordValid = bcrypt.compareSync(params.password, user.password);
        if (!isPasswordValid) throw new HttpError(401, "Invalid email or password");
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!, { expiresIn: "1h" });
        return token
    }
}