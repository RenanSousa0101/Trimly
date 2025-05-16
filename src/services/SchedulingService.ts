import { HttpError } from "../errors/HttpError";
import { SchedulingStatus } from "../generated/prisma";
import { IaddressRepository } from "../repositories/AddressRepository";
import { IclientRepository } from "../repositories/ClientRepository";
import { IphoneRepository } from "../repositories/PhoneRepository";
import { IproviderRepository } from "../repositories/ProviderRepository";
import { IproviderServiceRepository } from "../repositories/ProviderServiceRepository";
import { CreateSchedulingParams, IschedulingRepository } from "../repositories/SchedulingRepository";
import { IserviceRepository } from "../repositories/ServiceRepository";
import { validateAndFormatPhoneInternational } from "./functions/phone";
import { cnpj } from 'cpf-cnpj-validator';

export class Scheduling {

    constructor(
        private readonly schedulingRepository: IschedulingRepository,
        private readonly clientRepository: IclientRepository,
        private readonly providerRepository: IproviderRepository,
        private readonly serviceRepository: IserviceRepository,
        private readonly providerServiceRepository: IproviderServiceRepository,
        private readonly phoneRepository: IphoneRepository,
        private readonly addressRepository: IaddressRepository
    ) { }

    async createScheduling(clientId: number, providerId: number, serviceId: number, params: CreateSchedulingParams) {
        const [client, provider, service] = await Promise.all([
            this.clientRepository.findGlobalByClientId(clientId),
            this.providerRepository.findGlobalByProviderId(providerId),
            this.serviceRepository.findByServiceId(serviceId)
        ]);

        if (!client) throw new HttpError(404, `Client with ID ${clientId} not found`);
        if (!provider) throw new HttpError(404, `Provider with ID ${providerId} not found`);
        if (!service) throw new HttpError(404, `Service with ID ${serviceId} not found`);

        const providerService = await this.providerServiceRepository.findByProviderExistServiceId(provider.user_id, providerId, serviceId);
        if (!providerService) throw new HttpError(404, `Service with ID ${serviceId} is not offered by Provider with ID ${providerId}`);

        const createScheduling = await this.schedulingRepository.createScheduling(clientId, providerId, serviceId, { ...params, status: SchedulingStatus.Pending });

        const [phoneClient, phoneProvider, addressProvider] = await Promise.all([
            this.phoneRepository.findByUserIdPhoneId(client.user_id, client.phone_id),
            this.phoneRepository.findByUserIdPhoneId(provider.user_id, provider.phone_id),
            this.addressRepository.findByUserIdAddressId(provider.user_id, provider.address_id)
        ]);

        if (!phoneClient) throw new HttpError(404, `Client Phone not found for user ID ${client.user_id}`);
        if (!phoneProvider) throw new HttpError(404, `Provider Phone not found for user ID ${provider.user_id}`);
        if (!addressProvider) throw new HttpError(404, `Provider Address not found for user ID ${provider.user_id}`);

        return {
            client: {
                avatar: createScheduling.Client.user.avatar_url,
                name: createScheduling.Client.user.name,
                email: createScheduling.Client.user.email,
                phone: validateAndFormatPhoneInternational(phoneClient.phone_number)
            },
            service: {
                category: createScheduling.Service.Service_Category.name,
                categoryDescription: createScheduling.Service.Service_Category.description,
                name: createScheduling.Service.name,
                description: createScheduling.Service.description,
                duration: providerService.duration,
                notes: createScheduling.notes,
                appointment_date: createScheduling.appointment_date,
                price: providerService.price,
                status: createScheduling.status
            },
            provider: {
                name: createScheduling.Provider.user.name,
                business: createScheduling.Provider.business_name,
                cnpj: createScheduling.Provider.cnpj ? cnpj.format(createScheduling.Provider.cnpj) : createScheduling.Provider.cnpj,
                phone: validateAndFormatPhoneInternational(phoneProvider.phone_number),
                description: createScheduling.Provider.description,
                logo: createScheduling.Provider.logo_url,
                banner: createScheduling.Provider.banner_url,
                address: {
                    addressType: addressProvider.address_type,
                    country: addressProvider.district.city.state.country.name,
                    acronym: addressProvider.district.city.state.country.acronym,
                    state: addressProvider.district.city.state.name,
                    uf: addressProvider.district.city.state.uf,
                    city: addressProvider.district.city.name,
                    district: addressProvider.district.name,
                    street: addressProvider.street,
                    number: addressProvider.number,
                    cep: addressProvider.cep_street,
                    complement: addressProvider.complement
                }
            }
        }
    }
}