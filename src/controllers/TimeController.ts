import { Handler } from "express";
import { TimeService } from "../services/TimeService";
import { CreateTimeRequestSchema } from "./schemas/TimeRequestSchemas";

export class TimeController {

    constructor(private readonly timeService: TimeService) {}

    index: Handler = async (req, res, next) => {
        try{
            const id = Number(req.params.id);
            const providerId = Number(req.params.providerId);
            const getProviderTimes =  await this.timeService.getProviderTimes(id, providerId)
            res.status(200).json(getProviderTimes);
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try{
            const id = Number(req.params.id);
            const providerId = Number(req.params.providerId);
            const timeId = Number(req.params.timeId);
            const getProviderTime =  await this.timeService.getProviderTime(id, providerId, timeId)
            res.status(200).json(getProviderTime);
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try{
            const id = Number(req.params.id);
            const providerId = Number(req.params.providerId);
            const body = CreateTimeRequestSchema.parse(req.body);
            const getProviderTime =  await this.timeService.createProviderTime(id, providerId, body)
            res.status(200).json(getProviderTime);
        } catch (error) {
            next(error)
        }
    }
}