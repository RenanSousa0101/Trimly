import { Handler } from "express";
import { CreateUserRequestSchema, GetUserRequestSchema, UpdateUserRequestSchema } from "./schemas/UserRequestSchemas";
import { UsersService } from "../services/UserService";

export class UserController {

    constructor(private readonly usersService: UsersService) {}

    // SHOW ALL /users
    index: Handler = async (req, res, next) => {
       try {
            const query = GetUserRequestSchema.parse(req.query);
            const { page = "1", pageSize = "10" } = query;
            const result = await this.usersService.getAllUsersPaginated({
                ...query,
                page: +page,
                pageSize: +pageSize,
            })
            res.status(200).json({...result, password: undefined});
       } catch (error) {
            next(error);
       } 
    }
    // CREATE /users
    create: Handler = async (req, res, next) => {
        try {
            const body = CreateUserRequestSchema.parse(req.body);
            const newUser = await this.usersService.createUser(body)
            res.status(201).json({...newUser, password: undefined});
        } catch (error) {
            next(error);
        }
    }
    // SHOW ONE /users/:id
    show: Handler = async (req, res, next) => {
        try {
            const user = await this.usersService.getUserById(+req.params.id)
            res.status(200).json({user, password: undefined});
        } catch (error) {
            next(error);
        }
    }
    // UPDATE /users/:id
    update: Handler = async (req, res, next) => {
        try {
            const userRoleId = Number(req.params.userRoleId)
            const id = Number(req.params.id)
            const body = UpdateUserRequestSchema.parse(req.body)
            const updatedUser =  await this.usersService.updateUser(userRoleId, id, body)
            res.status(200).json({...updatedUser, password: undefined});
        } catch (error) {
            next(error);
        }
    }
    // DELETE /users/:id
    delete: Handler = async (req, res, next) => {
        try {
            const userRoleId = Number(req.params.userRoleId)
            const id = Number(req.params.id)
            const deletedUser = await this.usersService.deleteUser(userRoleId, id)
            res.status(200).json({ ...deletedUser, password: undefined })
        } catch (error) {
            next(error); 
        }
    }
}