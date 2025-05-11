import dayjs from "dayjs";
import { CreateTimeAttributes, DayOfTheWeek, TimeAttributes } from "../../repositories/TimeRepository";

export function formatTimeResponse(time: {id: number, day_of_week: number, start_time: Date, end_time: Date, created_at: Date, updated_at: Date}) { 
    if (!time) return undefined; 

    const startTime = dayjs.utc(time.start_time).format('HH:mm:ss');
    const endTime = dayjs.utc(time.end_time).format('HH:mm:ss');

    return {
        ...time,
        day_of_week: DayOfTheWeek[time.day_of_week],
        start_time: startTime,
        end_time: endTime,
        created_at: undefined,
        updated_at: undefined
    };
}