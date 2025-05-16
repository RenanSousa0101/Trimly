import { Handler } from "express";
import { SchedulingService } from "../services/SchedulingService";
import { CreateSchedulingRequestSchema } from "./schemas/SchedulingRequestSchemas";

export class SchedulingController {
    constructor(
        private readonly schedulingService: SchedulingService
    ) { }

    create: Handler = async (req, res, next) => {
        try {
            const clientId = Number(req.params.clientId);
            const providerId = Number(req.params.providerId);
            const serviceId = Number(req.params.serviceId)
            const body = CreateSchedulingRequestSchema.parse(req.body);
            const createScheduling = await this.schedulingService.createScheduling(clientId, providerId, serviceId, body);
            res.status(201).json({ message: "Scheduling created successfully!", createScheduling });
        } catch (error) {
            next(error)
        }
    }
}