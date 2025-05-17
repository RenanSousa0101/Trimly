import dayjs from "dayjs";
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
import { DayOfTheWeek, ItimeRepository } from "../repositories/TimeRepository";

export class SchedulingService {

    constructor(
        private readonly schedulingRepository: IschedulingRepository,
        private readonly clientRepository: IclientRepository,
        private readonly providerRepository: IproviderRepository,
        private readonly serviceRepository: IserviceRepository,
        private readonly providerServiceRepository: IproviderServiceRepository,
        private readonly phoneRepository: IphoneRepository,
        private readonly addressRepository: IaddressRepository,
        private readonly timeRepository: ItimeRepository
    ) { }

    async createScheduling(clientId: number, providerId: number, serviceId: number, params: CreateSchedulingParams) {
        const [client, provider, service, times] = await Promise.all([
            this.clientRepository.findGlobalByClientId(clientId),
            this.providerRepository.findGlobalByProviderId(providerId),
            this.serviceRepository.findByServiceId(serviceId),
            this.timeRepository.findTime(providerId)
        ]);

        if (!client) throw new HttpError(404, `Client with ID ${clientId} not found`);
        if (!provider) throw new HttpError(404, `Provider with ID ${providerId} not found`);
        if (!service) throw new HttpError(404, `Service with ID ${serviceId} not found`);
        if (!times) throw new HttpError(404, `Times with ID ${providerId} not found`);

        const [providerService, providerScheduling, clientScheduling] = await Promise.all([
            this.providerServiceRepository.findByProviderExistServiceId(provider.user_id, providerId, serviceId),
            this.schedulingRepository.findByProviderIdScheduling(providerId),
            this.schedulingRepository.findByClientIdScheduling(clientId)
        ]);

        let providerSchedulingEmpty, clientSchedulingEmpty
        
        if (!providerService) throw new HttpError(404, `Service ${service.name} is not offered by Provider ${provider.business_name}`);
        providerScheduling.length === 0 ? providerSchedulingEmpty = true : providerSchedulingEmpty = false
        clientScheduling.length === 0 ? clientSchedulingEmpty = true : clientSchedulingEmpty = false

        const dayTimes = times.filter(time => DayOfTheWeek[time.day_of_week] === dayjs(params.appointment_date).format('dddd'));
        const appointment = dayjs.utc(params.appointment_date).toDate()

        let appointmentConfirmed = dayTimes.some(time => dayjs.utc(time.start_time).format('HH:mm:ss') <= dayjs.utc(appointment).format('HH:mm:ss') && dayjs.utc(time.end_time).subtract(providerService.duration, 'minute').format('HH:mm:ss') > dayjs.utc(appointment).format('HH:mm:ss'))
        if (!appointmentConfirmed) throw new HttpError(409, "Unavailable time or amount of time unavailable for this service");

        if (!providerSchedulingEmpty) {
            const providerAllServices = await this.providerServiceRepository.findProviderAllServices(providerId);
            const appointmentProvider = providerScheduling.filter(scheduling => dayjs.utc(scheduling.appointment_date).format('DD/MM/YYYY') === dayjs.utc(params.appointment_date).format('DD/MM/YYYY'));

            const appointmentProviderEndService = appointmentProvider.map(appointment => {
                const service = providerAllServices.find(service => service.service_id === appointment.service_id);
                if (!service) {
                    console.error(`Service with ID ${appointment.service_id} not found for existing appointment ID ${appointment.id}`);
                    return null; 
                }
                const objAppointment = {...appointment, endService: dayjs.utc(appointment.appointment_date).add(service.duration, 'minute').toDate()}
                return objAppointment
            }).filter(appointment => appointment !== null)

            const newAppointmentStart = dayjs.utc(appointment);
            const newAppointmentEnd = newAppointmentStart.add(providerService.duration, 'minute');
            
            const hasConflict = appointmentProviderEndService.some(existingAppointment => {
                const existingAppointmentStart = dayjs.utc(existingAppointment.appointment_date);
                const existingAppointmentEnd = dayjs.utc(existingAppointment.endService);
                return newAppointmentStart.isBefore(existingAppointmentEnd) && newAppointmentEnd.isAfter(existingAppointmentStart);
            });
            
            if (hasConflict) {
                throw new HttpError(409, `The provider ${provider.business_name} already has an appointment at that time ${newAppointmentStart}`);
            }
        }
        
        const createScheduling = await this.schedulingRepository.createScheduling(clientId, providerId, serviceId, { ...params, appointment_date: dayjs.utc(params.appointment_date).toDate(), status: SchedulingStatus.Pending });

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
                phone: validateAndFormatPhoneInternational(phoneClient.phone_number),
                notes: createScheduling.notes
            },
            service: {
                category: createScheduling.Service.Service_Category.name,
                categoryDescription: createScheduling.Service.Service_Category.description,
                name: createScheduling.Service.name,
                description: createScheduling.Service.description,
                duration: providerService.duration,
                appointment_date: createScheduling.appointment_date,
                price: Number(providerService.price),
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