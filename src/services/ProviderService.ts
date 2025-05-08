import { HttpError } from "../errors/HttpError";
import { AddressType, PhoneType, Prisma, PrismaClient } from "../generated/prisma/client";
import { IaddressRepository } from "../repositories/AddressRepository";
import { IphoneRepository } from "../repositories/PhoneRepository";
import { FullProviderAttributes, IproviderRepository, ProviderWhereParams } from "../repositories/ProviderRepository";
import { IrolesRepository } from "../repositories/RolesRepository";
import { IuserRepository } from "../repositories/UserRepository";
import { removeMask } from "./functions/mask";
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { isPhoneValid, phoneFormated } from "./functions/phone";

const cpfFormat = cpf
const cnpjFormat = cnpj
interface GetProviderWithPaginationParams {
    page?: number
    pageSize?: number
    business_name?: string
    cnpj?: string | null
    cpf?: string | null
    sortBy?: "business_name" | "cpf" | "cnpj"
    order?: "asc" | "desc"
}

export class ProviderService {
    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly userRepository: IuserRepository,
        private readonly phoneRepository: IphoneRepository,
        private readonly addressRepository: IaddressRepository,
        private readonly rolesRepository: IrolesRepository,
        private readonly providerRepository: IproviderRepository
    ) { }

    async getAllProvidersPaginated(params: GetProviderWithPaginationParams) {
        const { business_name, cpf, cnpj, page = 1, pageSize = 10, sortBy, order } = params;

        const cpfMask = removeMask(cpf)
        const cnpjMask = removeMask(cnpj)

        const take = pageSize;
        const skip = (page - 1) * take;

        const where: ProviderWhereParams = {};

        if (business_name) where.business_name = { contains: business_name, mode: "insensitive" };

        if (cpfMask) where.cpf = cpfMask
        if (cnpjMask) where.cnpj = cnpjMask

        const providers = await this.providerRepository.findProviders({ where, sortBy, order, skip, take });
        const totalProviders = await this.providerRepository.countProvider(where);

        const formattedProviders = providers.map((provider) => {
            const newProvider = { ...provider }
            if (newProvider.cnpj) newProvider.cnpj = cnpjFormat.format(newProvider.cnpj)
            if (newProvider.cpf) newProvider.cpf = cpfFormat.format(newProvider.cpf)
            return newProvider
        });

        return {
            formattedProviders,
            meta: {
                page,
                pageSize,
                total: totalProviders,
                totalPages: Math.ceil(totalProviders / pageSize)
            }
        };
    }

    async findProvider(userId: number, providerId: number) {
        const userExist = await this.userRepository.findById(userId);
        if (!userExist) throw new HttpError(404, "User not found");

        const providerExist = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!providerExist) throw new HttpError(404, "Provider not found")

        const formattedProviderData = {
            id: userExist.id,
            name: userExist.name,
            provider: { ...providerExist }
        }

        if (formattedProviderData.provider.cpf) formattedProviderData.provider.cpf = cpfFormat.format(formattedProviderData.provider.cpf)
        if (formattedProviderData.provider.cnpj) formattedProviderData.provider.cnpj = cnpjFormat.format(formattedProviderData.provider.cnpj)
        
        return formattedProviderData
    }

    async createProvider(userId: number, params: FullProviderAttributes) {
        const userExist = await this.userRepository.findById(userId);
        if (!userExist) throw new HttpError(404, "User not found");

        const roleExist = await this.rolesRepository.findByRoleType("Provider");
        if (!roleExist) throw new HttpError(404, "Role not found");

        const roleId = roleExist.id

        const userRoleExist = await this.rolesRepository.findByUserIdRoleId(userId, roleId);
        if (userRoleExist) throw new HttpError(409, "User is already a Provider");

        const formattedProvider = await this.prismaClient.$transaction(async (transactionClient: Prisma.TransactionClient) => {

            const phoneValid = isPhoneValid(params.phone_number);

            const userProviderPhone = {
                phone_number: phoneValid,
                phone_type: PhoneType.Work,
                is_primary: true
            }

            const userProviderAddress = {
                street: params.street,
                number: params.number,
                cep_street: params.cep_street,
                complement: params.complement,
                address_type: AddressType.Work,
                district: {
                    name: params.district.name,
                    city: {
                        name: params.district.city.name,
                        state: {
                            name: params.district.city.state.name,
                            uf: params.district.city.state.uf,
                            country: {
                                name: params.district.city.state.country.name,
                                acronym: params.district.city.state.country.acronym
                            }
                        }
                    }
                }
            }

            const createUserProviderPhone = await this.phoneRepository.createPhone(userId, userProviderPhone, transactionClient as any);
            const createUserProviderAddress = await this.addressRepository.createAddress(userId, userProviderAddress, transactionClient as any);

            const addressId = createUserProviderAddress.id
            const phoneId = createUserProviderPhone.id

            const userProviderData = {
                business_name: params.business_name,
                description: params?.description,
                logo_url: params?.logo_url,
                banner_url: params?.banner_url,
                cnpj: params.cnpj ? removeMask(params.cnpj) : undefined,
                cpf: params.cpf ? removeMask(params.cpf) : undefined,
            }

            const newUserProvider = await this.providerRepository.createProvider(userId, addressId, phoneId, userProviderData, transactionClient as any)
            const addUserRole = await this.rolesRepository.addUserRole(userId, roleId, transactionClient as any);

            if (newUserProvider.cnpj) newUserProvider.cnpj = cnpj.format(newUserProvider.cnpj)
            if (newUserProvider.cpf) newUserProvider.cpf = cpf.format(newUserProvider.cpf)

            const formatPhone = phoneFormated(createUserProviderPhone.phone_number)

            const formattedProvider = {
                name: userExist.name,
                roles: addUserRole.roles.role_type,
                business_name: newUserProvider.business_name,
                description: newUserProvider.description,
                phone: formatPhone,
                phoneType: createUserProviderPhone.phone_type,
                cnpj: newUserProvider.cnpj,
                cpf: newUserProvider.cpf,
                address: {
                    addressType: userProviderAddress.address_type,
                    country: userProviderAddress.district.city.state.country.name,
                    acronym: userProviderAddress.district.city.state.country.acronym,
                    state: userProviderAddress.district.city.state.name,
                    uf: userProviderAddress.district.city.state.uf,
                    city: userProviderAddress.district.city.name,
                    district: userProviderAddress.district.name,
                    street: userProviderAddress.street,
                    number: userProviderAddress.number,
                    cep: userProviderAddress.cep_street,
                    complement: userProviderAddress.complement
                }
            }
            return formattedProvider;
        })
        return formattedProvider;
    }

    async updateProvider(userId: number, providerId: number, params: Partial<FullProviderAttributes>) {
        const userExist = await this.userRepository.findById(userId);
        if (!userExist) throw new HttpError(404, "User not found");

        const providerExist = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!providerExist) throw new HttpError(404, "Provider not found");

        const formattedProvider = await this.prismaClient.$transaction(async (transactionClient: Prisma.TransactionClient) => { 

            let phoneValid 

            if (params.phone_number) {
                phoneValid = isPhoneValid(params.phone_number)
            } else {
                phoneValid = params?.phone_number
            }

            const userProviderPhone = {
                phone_number: phoneValid,
                phone_type: PhoneType.Work,
                is_primary: true
            }

            const userProviderAddress = {
                street: params.street,
                number: params.number,
                cep_street: params.cep_street,
                complement: params.complement,
                address_type: AddressType.Work,
                district: {
                    name: params.district?.name,
                    city: {
                        name: params.district?.city.name,
                        state: {
                            name: params.district?.city.state.name,
                            uf: params.district?.city.state.uf,
                            country: {
                                name: params.district?.city.state.country.name,
                                acronym: params.district?.city.state.country.acronym
                            }
                        }
                    }
                }
            }
            
            const updateUserProviderData = {
                business_name: params?.business_name,
                description: params?.description,
                logo_url: params?.logo_url,
                banner_url: params?.banner_url,
                cnpj: params.cnpj ? removeMask(params.cnpj) : undefined,
                cpf: params.cpf ? removeMask(params.cpf) : undefined,
            }

            await this.addressRepository.updateByIdAddress(userId, providerExist.address_id, userProviderAddress, transactionClient as any);
            await this.phoneRepository.updateByIdPhone(userId, providerExist.phone_id, userProviderPhone, transactionClient as any);
            const updateProvider = await this.providerRepository.updateProvider(userId, providerId, updateUserProviderData, transactionClient as any);

            const findPhone = await this.phoneRepository.findByUserIdPhoneId(updateProvider.user_id, updateProvider.phone_id, transactionClient as any)
            const findAddress = await this.addressRepository.findByUserIdAddressId(updateProvider.user_id, updateProvider.address_id, transactionClient as any)

            const formatedPhone = phoneFormated(findPhone!.phone_number);

            const formattedProvider = { 
                name: userExist.name,
                business_name: updateProvider.business_name,
                description: updateProvider.description,
                phone: formatedPhone,
                phoneType: findPhone!.phone_type,
                cnpj: updateProvider.cnpj,
                cpf: updateProvider.cpf,
                address: {
                    addressType: findAddress!.address_type,
                    country: findAddress!.district.city.state.country.name,
                    acronym: findAddress!.district.city.state.country.acronym,
                    state: findAddress!.district.city.state.name,
                    uf: findAddress!.district.city.state.uf,
                    city: findAddress!.district.city.name,
                    district: findAddress!.district.name,
                    street: findAddress!.street,
                    number: findAddress!.number,
                    cep: findAddress!.cep_street,
                    complement: findAddress!.complement
                }
            }
            return formattedProvider
        })
        return formattedProvider
    }
}