import { UserController } from "./controllers/UserController";
import { PhoneController } from "./controllers/PhoneController";
import { AddressController } from "./controllers/AddressController";
import { RolesController } from "./controllers/RolesController";
import { AuthController } from "./controllers/authController";
import { PrismaUserRepository } from "./repositories/prisma/PrismaUserRepository";
import { PrismaPhoneRepository } from "./repositories/prisma/PrismaPhoneRepository";
import { PrismaAddressRepository } from "./repositories/prisma/PrismaAddressRepository";
import { PrismaRoleRepository } from "./repositories/prisma/PrismaRoleRepository";
import { UsersService } from "./services/UserService";
import { PhoneService } from "./services/PhoneService";
import { AddressService } from "./services/AddressService";
import { RolesService } from "./services/RolesService";

const userRepository = new PrismaUserRepository
const phoneRepository = new PrismaPhoneRepository
const addressRepository = new PrismaAddressRepository
const rolesRepository = new PrismaRoleRepository

export const usersService = new UsersService(userRepository)
export const phoneService = new PhoneService(phoneRepository, userRepository)
export const addressService = new AddressService(addressRepository, userRepository)
export const rolesService = new RolesService(rolesRepository, userRepository)

export const userController = new UserController(usersService)
export const phoneController = new PhoneController(phoneService)
export const addressController = new AddressController(addressService)
export const rolesController = new RolesController(rolesService)
export const authController = new AuthController(userRepository)