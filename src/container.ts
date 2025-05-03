import { UserController } from "./controllers/UserController";
import { PhoneController } from "./controllers/PhoneController";
import { AddressController } from "./controllers/AddressController";
import { RolesController } from "./controllers/RolesController";
import { AuthController } from "./controllers/AuthController";
import { PrismaUserRepository } from "./repositories/prisma/PrismaUserRepository";
import { PrismaPhoneRepository } from "./repositories/prisma/PrismaPhoneRepository";
import { PrismaAddressRepository } from "./repositories/prisma/PrismaAddressRepository";
import { PrismaRoleRepository } from "./repositories/prisma/PrismaRoleRepository";
import { UsersService } from "./services/UserService";
import { PhoneService } from "./services/PhoneService";
import { AddressService } from "./services/AddressService";
import { RolesService } from "./services/RolesService";
import { AuthService } from "./services/AuthService";
import { EmailService } from "./services/EmailService";

export const userRepository = new PrismaUserRepository
export const phoneRepository = new PrismaPhoneRepository
export const addressRepository = new PrismaAddressRepository
export const rolesRepository = new PrismaRoleRepository

export const emailService = new EmailService();

export const usersService = new UsersService(userRepository, rolesRepository)
export const phoneService = new PhoneService(phoneRepository, userRepository)
export const addressService = new AddressService(addressRepository, userRepository)
export const rolesService = new RolesService(rolesRepository, userRepository)
export const authService = new AuthService(userRepository, rolesRepository, emailService)

export const userController = new UserController(usersService)
export const phoneController = new PhoneController(phoneService)
export const addressController = new AddressController(addressService)
export const rolesController = new RolesController(rolesService)
export const authController = new AuthController(authService)