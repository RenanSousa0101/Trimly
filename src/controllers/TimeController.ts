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
            const createProviderTime =  await this.timeService.createProviderTime(id, providerId, body);
            res.status(200).json(createProviderTime);
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try{
            const id = Number(req.params.id);
            const providerId = Number(req.params.providerId);
            const timeId = Number(req.params.timeId);
            const body = CreateTimeRequestSchema.parse(req.body);
            const updatedProviderTime =  await this.timeService.updateProviderTime(id, providerId, timeId, body);
            res.status(200).json(updatedProviderTime);
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try{
            const id = Number(req.params.id);
            const providerId = Number(req.params.providerId);
            const timeId = Number(req.params.timeId);
            const deletedProviderTime =  await this.timeService.deleteProviderTime(id, providerId, timeId);
            res.status(200).json(deletedProviderTime);
        } catch (error) {
            next(error)
        }
    }
}