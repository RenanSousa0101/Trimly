import { HttpError } from "../errors/HttpError";
import { IproviderRepository } from "../repositories/ProviderRepository";
import { DayOfTheWeek, ItimeRepository, TimeAttributes } from "../repositories/TimeRepository";
import { IuserRepository } from "../repositories/UserRepository";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { formatTimeResponse } from "./functions/formatTime";

dayjs.extend(utc);
export class TimeService {

    constructor(
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

        const formatedTimes = getProviderTimes.map(time => formatTimeResponse(time));

        return formatedTimes;
    }

    async getProviderTime(userId: number, providerId: number, timeId: number) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) throw new HttpError(404, "Provider not found");

        const getProviderTime = await this.timeRepository.findByTimeId(providerId, timeId);
        if (!getProviderTime) throw new HttpError(404, "Time not found");

        return formatTimeResponse(getProviderTime);
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
    
        return formatTimeResponse(createNewTime);
    }

    async updateProviderTime(userId: number, providerId: number, timeId: number, params: TimeAttributes) {

        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) throw new HttpError(404, "Provider not found");

        const time = await this.timeRepository.findByTimeId(providerId, timeId);
        if (!time) throw new HttpError(404, "Time not found");

        const allTimes = await this.timeRepository.findTime(providerId) || [];

        const day = DayOfTheWeek[params.day_of_week];

        const timesForDay = allTimes.filter(time => time.day_of_week === day);
        const updateTimeForDay = timesForDay.filter(time => time.id !== timeId);

        const timeStringStart = "1970-01-01T" + params.start_time;
        const timeStringEnd = "1970-01-01T" + params.end_time;

        const dateStartTime = dayjs.utc(timeStringStart).toDate()
        const dateEndTime = dayjs.utc(timeStringEnd).toDate()

        if (dateStartTime >= dateEndTime) {
            throw new HttpError(400, "The start time must be before the end time.");
        }

        updateTimeForDay.forEach(time => {
            if (time.start_time < dateEndTime && time.end_time > dateStartTime) {
                throw new HttpError(409, "Schedule conflict");
            }
        })

        const updateTime = await this.timeRepository.updateTime(providerId, timeId, {...params, day_of_week: day, start_time: dateStartTime, end_time: dateEndTime});

        return formatTimeResponse(updateTime);
    }

    async deleteProviderTime(userId: number, providerId: number, timeId: number) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new HttpError(404, "User not found");

        const provider = await this.providerRepository.findByIdProvider(userId, providerId);
        if (!provider) throw new HttpError(404, "Provider not found");

        const time = await this.timeRepository.findByTimeId(providerId, timeId);
        if (!time) throw new HttpError(404, "Time not found");

        const deleteTime = await this.timeRepository.deleteTime(providerId, timeId);

        return formatTimeResponse(deleteTime)
    }
}