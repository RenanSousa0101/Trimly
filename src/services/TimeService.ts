import { HttpError } from "../errors/HttpError";
import { PrismaClient } from "../generated/prisma/client";
import { IproviderRepository } from "../repositories/ProviderRepository";
import { DayOfTheWeek, ItimeRepository, TimeAttributes } from "../repositories/TimeRepository";
import { IuserRepository } from "../repositories/UserRepository";
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Certificate } from "crypto";

dayjs.extend(utc);
dayjs.extend(timezone);
export class TimeService {

    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly userRepository: IuserRepository,
        private readonly providerRepository: IproviderRepository,
        private readonly timeRepository: ItimeRepository
    ) { }

    async getProviderTimes(userId: number, providerId: number) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) throw new HttpError(404, "Provider not found");

        const getProviderTimes = await this.timeRepository.findTime(providerId);
        if (!getProviderTimes) throw new HttpError(404, "Times not found");

        const formatedTimes = getProviderTimes.map(time => {
            const startTime = dayjs.utc(time.start_time).format('HH:mm:ss')
            const endTime = dayjs.utc(time.end_time).format('HH:mm:ss')
        
            return {
                ...time, 
                day_of_week: DayOfTheWeek[time.day_of_week],
                start_time: startTime,
                end_time: endTime,
                created_at: undefined,
                updated_at: undefined
            }
        })

        return formatedTimes
    }

    async getProviderTime(userId: number, providerId: number, timeId: number) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) throw new HttpError(404, "Provider not found");

        const getProviderTime = await this.timeRepository.findByTimeId(providerId, timeId);
        if (!getProviderTime) throw new HttpError(404, "Time not found");

        const startTime = dayjs.utc(getProviderTime.start_time).format('HH:mm:ss')
        const endTime = dayjs.utc(getProviderTime.end_time).format('HH:mm:ss')
    
        return {
            ...getProviderTime, 
            day_of_week: DayOfTheWeek[getProviderTime.day_of_week],
            start_time: startTime,
            end_time: endTime,
            created_at: undefined,
            updated_at: undefined
        }
    }

    async createProviderTime(userId: number, providerId: number, params: TimeAttributes) {

        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) throw new HttpError(404, "Provider not found");

        const allTimes = await this.timeRepository.findTime(providerId) || [];

        const day = DayOfTheWeek[params.day_of_week];

        const timesForDay = allTimes.filter(time => time.day_of_week === day);

        const timeStringStart = "1970-01-01T" + params.start_time;
        const timeStringEnd = "1970-01-01T" + params.end_time;

        const dateStartTime = dayjs.utc(timeStringStart).toDate()
        const dateEndTime = dayjs.utc(timeStringEnd).toDate()

        if (dateStartTime >= dateEndTime) {
            throw new HttpError(400, "The start time must be before the end time.");
        }

        timesForDay.forEach(time => {
            if (time.start_time < dateEndTime && time.end_time > dateStartTime) {
                throw new HttpError(409, "Schedule conflict");
            }
        })
        
        const createNewTime = await this.timeRepository.createTime(providerId, {...params, day_of_week: day, start_time: dateStartTime, end_time: dateEndTime})
        
        const startTime = dayjs.utc(createNewTime.start_time).format('HH:mm:ss')
        const endTime = dayjs.utc(createNewTime.end_time).format('HH:mm:ss')
    
        return {
            ...createNewTime, 
            day_of_week: DayOfTheWeek[createNewTime.day_of_week],
            start_time: startTime,
            end_time: endTime,
            created_at: undefined,
            updated_at: undefined
        }
    }
}