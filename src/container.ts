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
import { PrismaTokenRepository } from "./repositories/prisma/PrismaTokenRepository";
import { PasswordService } from "./services/PasswordService";
import { PrismaProviderRepository } from "./repositories/prisma/PrismaProviderRepository";
import { ProviderService } from "./services/ProviderService";
import { ProviderController } from "./controllers/ProviderController";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaSpecializationRepository } from "./repositories/prisma/PrismaSpecializationRepository";
import { SpecializationService } from "./services/SpecializationService";
import { SpecializationController } from "./controllers/SpecializationController";
import { PrismaTimeRepository } from "./repositories/prisma/PrismaTimeRepository";
import { TimeService } from "./services/TimeService";
import { TimeController } from "./controllers/TimeController";
import { PrismaServiceCategoryRepository } from "./repositories/prisma/PrismaServiceCategoryRepository";
import { ServiceCategoryService } from "./services/ServiceCategoryService";
import { ServiceCategoryController } from "./controllers/ServiceCategoryController";
import { PrismaServiceRepository } from "./repositories/prisma/PrismaServiceRepository";
import { ServiceService } from "./services/ServiceService";
import { ServiceController } from "./controllers/ServiceController";
import { PrismaProviderServiceRepository } from "./repositories/prisma/PrismaProviderServiceRepository";
import { ProviderServiceService } from "./services/ProviderServiceService";
import { ProviderServiceController } from "./controllers/ProviderServiceController";
import { PrismaClientRepository } from "./repositories/prisma/PrismaClientRepository";
import { ClientService } from "./services/ClientService";
import { ClientController } from "./controllers/ClientController";

export const prismaClient = new PrismaClient();

export const userRepository = new PrismaUserRepository(prismaClient)
export const phoneRepository = new PrismaPhoneRepository(prismaClient)
export const addressRepository = new PrismaAddressRepository(prismaClient)
export const rolesRepository = new PrismaRoleRepository(prismaClient)
export const tokenRepository = new PrismaTokenRepository(prismaClient)
export const providerRepository = new PrismaProviderRepository(prismaClient)
export const specializationRepository = new PrismaSpecializationRepository(prismaClient)
export const timeRepository = new PrismaTimeRepository(prismaClient)
export const serviceCategoryRepository = new PrismaServiceCategoryRepository(prismaClient)
export const serviceRepository = new PrismaServiceRepository(prismaClient)
export const providerServiceRepository = new PrismaProviderServiceRepository(prismaClient)
export const clientRepository = new PrismaClientRepository(prismaClient)

export const emailService = new EmailService;
export const passwordService = new PasswordService;

export const usersService = new UsersService(userRepository, rolesRepository)
export const phoneService = new PhoneService(phoneRepository, userRepository)
export const addressService = new AddressService(addressRepository, userRepository)
export const rolesService = new RolesService(rolesRepository, userRepository)
export const authService = new AuthService(
    userRepository, rolesRepository, tokenRepository, emailService, passwordService
)
export const providerService = new ProviderService(
    prismaClient, userRepository, phoneRepository, addressRepository, rolesRepository, providerRepository
)
export const specializationService = new SpecializationService(prismaClient, userRepository, providerRepository, specializationRepository)
export const timeService = new TimeService(userRepository, providerRepository, timeRepository)
export const serviceCategoryService = new ServiceCategoryService(serviceCategoryRepository)
export const serviceService = new ServiceService(serviceRepository, serviceCategoryRepository)
export const providerServiceService = new ProviderServiceService(userRepository, providerRepository, serviceRepository, providerServiceRepository)
export const clientService = new ClientService(
    prismaClient, userRepository, phoneRepository, addressRepository, rolesRepository, clientRepository
)

export const userController = new UserController(usersService)
export const phoneController = new PhoneController(phoneService)
export const addressController = new AddressController(addressService)
export const rolesController = new RolesController(rolesService)
export const authController = new AuthController(authService)
export const providerController = new ProviderController(providerService)
export const specializationController = new SpecializationController(specializationService)
export const timeController = new TimeController(timeService)
export const serviceCategoryController = new ServiceCategoryController(serviceCategoryService)
export const serviceController = new ServiceController(serviceService)
export const providerServiceController = new ProviderServiceController(providerServiceService)
export const clientController = new ClientController(clientService)