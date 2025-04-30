import { UserController } from "./controllers/UserController";
import { PhoneController } from "./controllers/PhoneController";
import { AddressController } from "./controllers/AddressController";
import { RolesController } from "./controllers/RolesController";
import { AuthController } from "./controllers/authController";
import { PrismaUserRepository } from "./repositories/prisma/PrismaUserRepository";
import { PrismaPhoneRepository } from "./repositories/prisma/PrismaPhoneRepository";

const userRepository = new PrismaUserRepository
const phoneRepository = new PrismaPhoneRepository

export const userController = new UserController(userRepository)
export const phoneController = new PhoneController(phoneRepository, userRepository)
export const addressController = new AddressController()
export const rolesController = new RolesController()
export const authController = new AuthController()