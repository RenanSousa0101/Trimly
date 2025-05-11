import { Time } from "../generated/prisma/client"
import { PrismaClientOrTransaction } from "./ClientTransaction"

export interface TimeAttributes {
    day_of_week: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"
    start_time: string
    end_time: string
}

export interface CreateTimeAttributes {
    day_of_week: 1 | 2 | 3 | 4 | 5 | 6 | 7
    start_time: Date
    end_time: Date
}

export enum DayOfTheWeek {
    Sunday = 1,
    Monday = 2,
    Tuesday = 3,
    Wednesday = 4,
    Thursday = 5,
    Friday  = 6,
    Saturday = 7,
}

export interface ItimeRepository {
    findTime: (providerId: number, client?: PrismaClientOrTransaction) => Promise<Time[] | null>
    findByTimeId: (providerId: number, timeId: number, client?: PrismaClientOrTransaction) => Promise<Time | null>
    createTime: (providerId: number, attributes: CreateTimeAttributes, client?: PrismaClientOrTransaction) => Promise<Time>
    updateTime: (providerId: number, timeId: number, attributes: Partial<CreateTimeAttributes>, client?: PrismaClientOrTransaction) => Promise<Time>
    deleteTime: (providerId: number, timeId: number, client?: PrismaClientOrTransaction) => Promise<Time>
}