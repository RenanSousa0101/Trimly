import { HttpError } from "../errors/HttpError";
import { AddressType, PhoneType, Prisma, PrismaClient } from "../generated/prisma/client";
import { IaddressRepository } from "../repositories/AddressRepository";
import { IphoneRepository } from "../repositories/PhoneRepository";
import { IrolesRepository } from "../repositories/RolesRepository";
import { IuserRepository } from "../repositories/UserRepository";
import { removeMask } from "./functions/mask";
import { cpf } from 'cpf-cnpj-validator';
import { validateAndFormatPhoneE164, validateAndFormatPhoneInternational } from "./functions/phone";
import { ClientWhereParams, FullClientAttributes, IclientRepository } from "../repositories/ClientRepository";

const cpfFormat = cpf

interface GetClientWithPaginationParams {
    page?: number
    pageSize?: number
    cpf?: string | null
    sortBy?: "cpf" 
    order?: "asc" | "desc"
}

export class ClientService {
    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly userRepository: IuserRepository,
        private readonly phoneRepository: IphoneRepository,
        private readonly addressRepository: IaddressRepository,
        private readonly rolesRepository: IrolesRepository,
        private readonly clientRepository: IclientRepository
    ) { }

    async getAllClientsPaginated(params: GetClientWithPaginationParams) {
        const { cpf, page = 1, pageSize = 10, sortBy, order } = params;

        const cpfMask = removeMask(cpf)

        const take = pageSize;
        const skip = (page - 1) * take;

        const where: ClientWhereParams = {};

        if (cpfMask) where.cpf = cpfMask

        const clients = await this.clientRepository.findClients({ where, sortBy, order, skip, take });
        const totalClients = await this.clientRepository.countClient(where);

        const formattedClients = clients.map((client) => {
            const newClient = { ...client }
            if (newClient.cpf) newClient.cpf = cpfFormat.format(newClient.cpf)
            return newClient
        });

        return {
            formattedClients,
            meta: {
                page,
                pageSize,
                total: totalClients,
                totalPages: Math.ceil(totalClients / pageSize)
            }
        };
    }

    async findClient(userId: number, clientId: number) {
        const userExist = await this.userRepository.findById(userId);
        if (!userExist) throw new HttpError(404, "User not found");

        const clientExist = await this.clientRepository.findByIdClient(userId, clientId);
        if (!clientExist) throw new HttpError(404, "Client not found")

        const formattedClientData = {
            id: userExist.id,
            name: userExist.name,
            client: { ...clientExist }
        }

        if (formattedClientData.client.cpf) formattedClientData.client.cpf = cpfFormat.format(formattedClientData.client.cpf)

        return formattedClientData
    }

    async createClient(userId: number, params: FullClientAttributes) {
        const userExist = await this.userRepository.findById(userId);
        if (!userExist) throw new HttpError(404, "User not found");

        const roleExist = await this.rolesRepository.findByRoleType("Client");
        if (!roleExist) throw new HttpError(404, "Role not found");

        const roleId = roleExist.id

        const userRoleExist = await this.rolesRepository.findByUserIdRoleId(userId, roleId);
        if (userRoleExist) throw new HttpError(409, "User is already a Client");

        const transactionClient = await this.prismaClient.$transaction(async (transactionClient: Prisma.TransactionClient) => {

            const phoneNumberFormated = validateAndFormatPhoneE164(params.phone_number);

            const userClientPhone = {
                phone_number: phoneNumberFormated,
                phone_type: PhoneType.Home,
                is_primary: true
            }

            const userClientAddress = {
                street: params.street,
                number: params.number,
                cep_street: params.cep_street,
                complement: params.complement,
                address_type: AddressType.Home,
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

            const createUserClientPhone = await this.phoneRepository.createPhone(userId, userClientPhone, transactionClient as any);
            const createUserClientAddress = await this.addressRepository.createAddress(userId, userClientAddress, transactionClient as any);

            const addressId = createUserClientAddress.id
            const phoneId = createUserClientPhone.id

            const userClientData = {
                cpf: removeMask(params.cpf),
                communication_preference: params.communication_preference
            }

            const newUserClient = await this.clientRepository.createClient(userId, addressId, phoneId, userClientData, transactionClient as any)
            const addUserRole = await this.rolesRepository.addUserRole(userId, roleId, transactionClient as any);

            if (newUserClient.cpf) newUserClient.cpf = cpf.format(newUserClient.cpf)

            const formatPhone = validateAndFormatPhoneInternational(createUserClientPhone.phone_number)

            const formattedClient = {
                name: userExist.name,
                roles: addUserRole.roles.role_type,
                phone: formatPhone,
                phoneType: createUserClientPhone.phone_type,
                cpf: newUserClient.cpf,
                communication_preference: newUserClient.communication_preference,
                address: {
                    addressType: userClientAddress.address_type,
                    country: userClientAddress.district.city.state.country.name,
                    acronym: userClientAddress.district.city.state.country.acronym,
                    state: userClientAddress.district.city.state.name,
                    uf: userClientAddress.district.city.state.uf,
                    city: userClientAddress.district.city.name,
                    district: userClientAddress.district.name,
                    street: userClientAddress.street,
                    number: userClientAddress.number,
                    cep: userClientAddress.cep_street,
                    complement: userClientAddress.complement
                }
            }
            return formattedClient;
        })
        return transactionClient;
    }

    async updateClient(userId: number, clientId: number, params: Partial<FullClientAttributes>) {
        const userExist = await this.userRepository.findById(userId);
        if (!userExist) throw new HttpError(404, "User not found");

        const clientExist = await this.clientRepository.findByIdClient(userId, clientId);
        if (!clientExist) throw new HttpError(404, "Client not found");

        const transactionClient = await this.prismaClient.$transaction(async (transactionClient: Prisma.TransactionClient) => {

            let phoneNumberFormated

            if (params.phone_number) {
                phoneNumberFormated = validateAndFormatPhoneE164(params.phone_number)
            } else {
                phoneNumberFormated = params?.phone_number
            }

            const userClientPhone = {
                phone_number: phoneNumberFormated,
                phone_type: PhoneType.Home,
                is_primary: true
            }

            const userClientAddress = {
                street: params.street,
                number: params.number,
                cep_street: params.cep_street,
                complement: params.complement,
                address_type: AddressType.Home,
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

            const updateUserClientData = {
                cpf: params.cpf ? removeMask(params.cpf) : undefined,
                communication_preference: params.communication_preference
            }

            await this.addressRepository.updateByIdAddress(userId, clientExist.address_id, userClientAddress, transactionClient as any);
            await this.phoneRepository.updateByIdPhone(userId, clientExist.phone_id, userClientPhone, transactionClient as any);
            const updateClient = await this.clientRepository.updateClient(userId, clientId, updateUserClientData, transactionClient as any);

            const findPhone = await this.phoneRepository.findByUserIdPhoneId(updateClient.user_id, updateClient.phone_id, transactionClient as any)
            const findAddress = await this.addressRepository.findByUserIdAddressId(updateClient.user_id, updateClient.address_id, transactionClient as any)

            const formatedPhone = validateAndFormatPhoneInternational(findPhone!.phone_number);
            if (updateClient.cpf) updateClient.cpf = cpfFormat.format(updateClient.cpf)

            const formattedClient = {
                name: userExist.name,
                phone: formatedPhone,
                phoneType: findPhone!.phone_type,
                cpf: updateClient.cpf,
                communication_preference: updateClient.communication_preference,
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
            return formattedClient
        })
        return transactionClient
    }

    async deleteClient(userId: number, ClientId: number) {
        const userExist = await this.userRepository.findById(userId);
        if (!userExist) throw new HttpError(404, "User not found");

        const clientExist = await this.clientRepository.findByIdClient(userId, ClientId);
        if (!clientExist) throw new HttpError(404, "Client not found");

        const roleExist = await this.rolesRepository.findByRoleType("Client");
        if (!roleExist) throw new HttpError(404, "Role not found");

        const findAddress = await this.addressRepository.findByUserIdAddressId(clientExist.user_id, clientExist.address_id)

        const roleId = roleExist.id

        const transactionClient = await this.prismaClient.$transaction(async (transactionClient: Prisma.TransactionClient) => {
            const address = await this.addressRepository.deleteByIdAddress(clientExist.user_id, clientExist.address_id, transactionClient as any);
            const phone = await this.phoneRepository.deleteByIdPhone(clientExist.user_id, clientExist.phone_id, transactionClient as any);
            const role = await this.rolesRepository.deletedByUserIdRoleId(clientExist.user_id, roleId, transactionClient as any);
            const client = await this.clientRepository.deleteClient(clientExist.user_id, clientExist.id, transactionClient as any);

            const formatedPhone = validateAndFormatPhoneInternational(phone!.phone_number);
            if (client.cpf) client.cpf = cpfFormat.format(client.cpf)

            const result = {
                name: userExist.name,
                phone: formatedPhone,
                phoneType: phone!.phone_type,
                cpf: client.cpf,
                communication_preference: client.communication_preference,
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

            return result
        })
        return transactionClient
    }
}