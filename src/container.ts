import { UserController } from "./controllers/UserController";
import { PhoneController } from "./controllers/PhoneController";
import { AddressController } from "./controllers/AddressController";
import { RolesController } from "./controllers/RolesController";
import { AuthController } from "./controllers/authController";
import { PrismaUserRepository } from "./repositories/prisma/PrismaUserRepository";

const userRepository = new PrismaUserRepository

export const userController = new UserController(userRepository)
export const phoneController = new PhoneController()
export const addressController = new AddressController()
export const rolesController = new RolesController()
export const authController = new AuthController()