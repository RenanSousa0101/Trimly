import { HttpError } from "../errors/HttpError";
import { PrismaClient } from "../generated/prisma/client";
import { IproviderRepository } from "../repositories/ProviderRepository";
import { DayOfTheWeek, ItimeRepository, TimeAttributes } from "../repositories/TimeRepository";
import { IuserRepository } from "../repositories/UserRepository";

export class TimeService {

    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly userRepository: IuserRepository,
        private readonly providerRepository: IproviderRepository,
        private readonly timeRepository: ItimeRepository
    ){}

    async getProviderTimes(userId: number, providerId: number) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) throw new HttpError(404, "Provider not found");

        const getProviderTimes = await this.timeRepository.findTime(providerId);
        if (!getProviderTimes) throw new HttpError(404, "Times not found");

        return getProviderTimes
    }

    async getProviderTime(userId: number, providerId: number, timeId: number) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) throw new HttpError(404, "Provider not found");

        const getProviderTime = await this.timeRepository.findByTimeId(providerId, timeId);
        if (!getProviderTime) throw new HttpError(404, "Time not found");

        return getProviderTime
    }

    async createProviderTime(userId: number, providerId: number, params: TimeAttributes) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) throw new HttpError(404, "Provider not found");

        const allTimes = await this.timeRepository.findTime(providerId) || [];

        const day = DayOfTheWeek[params.day_of_week];

        const timesForDay = allTimes.filter(time => time.day_of_week === day);

        const newStartTime: Date = new Date(params.start_time);
        const newEndTime: Date = new Date(params.end_time);

        for (const existingTime of timesForDay) {
            
            const existingStartTime: Date = existingTime.start_time;
            const existingEndTime: Date = existingTime.end_time;
    
            const overlaps = (newStartTime < existingEndTime && newEndTime > existingStartTime);
    
            if (overlaps) {
                throw new HttpError(400, "New time slot overlaps with an existing time for this day.");
            }
        }
    
        const createdTime = await this.timeRepository.createTime(providerId, { ...params, day_of_week: day, start_time: newStartTime, end_time: newEndTime });
    
        return createdTime;
    }
}