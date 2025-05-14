import { Handler } from "express";
import { ClientService } from "../services/ClientService";
import { CreateClientRequestSchema, GetClientRequestSchema, UpdateClientRequestSchema } from "./schemas/ClientRequestSchemas";

export class ClientController {
    constructor(
        private readonly clientService: ClientService
    ) { }

    index: Handler = async (req, res, next) => {
        try {
            const query = GetClientRequestSchema.parse(req.query);
            const { page = "1", pageSize = "10" } = query;

            const result = await this.clientService.getAllClientsPaginated({
                ...query,
                page: +page,
                pageSize: +pageSize,
            });

            res.status(200).json({ ...result });
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const userId = Number(req.params.id);
            const clientId = Number(req.params.clientId)
            const findByIdClient = await this.clientService.findClient(userId, clientId)
            res.status(200).json({ ...findByIdClient })
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const userId = Number(req.params.id);
            const body = CreateClientRequestSchema.parse(req.body);
            const createClient = await this.clientService.createClient(userId, body);
            res.status(201).json({ message: "Client role created successfully!", createClient });
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const userId = Number(req.params.id);
            const clientId = Number(req.params.clientId);
            const body = UpdateClientRequestSchema.parse(req.body);
            const updatedClient = await this.clientService.updateClient(userId, clientId, body);
            res.status(201).json({ message: "Client updated successfully!", updatedClient });
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const userId = Number(req.params.id);
            const clientId = Number(req.params.clientId);
            const deletedClient = await this.clientService.deleteClient(userId, clientId);
            res.status(201).json({ message: "Client deleted successfully!", deletedClient });
        } catch (error) {
            next(error)
        }
    }
}