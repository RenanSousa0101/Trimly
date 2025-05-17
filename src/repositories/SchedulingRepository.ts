import { Scheduling } from "../../prisma/prisma"
import { SchedulingStatus } from "../generated/prisma/client"
import { Decimal } from "../generated/prisma/runtime/library"
import { PrismaClientOrTransaction } from "./ClientTransaction"

export interface CreateScheduling {
    appointment_date: Date
    notes: string
    status: SchedulingStatus
}

export interface CreateSchedulingParams {
    appointment_date: string
    notes: string
}

export interface FullScheduling {
    appointment_date: Date
    notes?: string | null
    status: SchedulingStatus
    Client: {
        user: {
            name: string,
            email: string,
            avatar_url?: string | null
        }
        user_id: number,
        phone_id: number,
        address_id: number
    }
    Service: {
        Service_Category: {
            name: string,
            description?: string | null
        }
        Provider_Service: {
            id: number,
            service_id: number,
            price: Decimal,
            duration: number
        }[]
        name: string,
        description?: string | null
    }
    Provider: {
        user: {
            name: string,
        }
        user_id: number,
        phone_id: number,
        address_id: number,
        business_name: string,
        cnpj?: string | null,
        logo_url?: string | null,
        banner_url?: string | null,
        avarage_rating: number | null,
        description?: string | null
    }
}

export interface ReturnScheduling {
    id: number
    appointment_date: Date
    notes?: string | null
    status: SchedulingStatus
    Service: {
        Provider_Service: {
            id: number,
            service_id: number,
            price: Decimal,
            duration: number
        }[]
        id: number,
        name: string,
        description?: string | null
    }
}

export interface IschedulingRepository {
    findByProviderIdScheduling: (providerId: number, client?: PrismaClientOrTransaction) => Promise<ReturnScheduling[]>
    findByClientIdScheduling: (clientId: number, client?: PrismaClientOrTransaction) => Promise<ReturnScheduling[]>
    createScheduling: (clientId: number, providerId: number, serviceId: number, attributes: CreateScheduling, client?: PrismaClientOrTransaction) => Promise<FullScheduling>
}