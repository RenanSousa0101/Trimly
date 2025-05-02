import { Handler, Request, Response, NextFunction } from "express";
import { CreateUserRequestSchema, GetUserRequestSchema, UpdateUserRequestSchema } from "./schemas/UserRequestSchemas";
import { UsersService } from "../services/UserService";
import '../middlewares/auth-middleware'; 
export class UserController {

    constructor(private readonly usersService: UsersService) {}

    index: Handler = async (req: Request, res: Response, next: NextFunction) => {
       try {
            const query = GetUserRequestSchema.parse(req.query);
            const { page = "1", pageSize = "10" } = query;

            const result = await this.usersService.getAllUsersPaginated({
                ...query,
                page: +page,
                pageSize: +pageSize,
            });

            res.status(200).json({...result, password: undefined});

       } catch (error) {
            next(error);
       }
    }

    
    create: Handler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = CreateUserRequestSchema.parse(req.body);
            const newUser = await this.usersService.createUser(body);
            res.status(201).json({...newUser, password: undefined});
        } catch (error) {
            next(error);
        }
    }

    
    show: Handler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const targetUserId = parseInt(req.params.id, 10);
            const user = await this.usersService.getUserById(targetUserId);
            res.status(200).json({user, password: undefined});
        } catch (error) {
            next(error);
        }
    }

    
    update: Handler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const actingUserId = req.user!.id; 
            const targetUserId = parseInt(req.params.id, 10); 
            const body = UpdateUserRequestSchema.parse(req.body);
            const updatedUser =  await this.usersService.updateUser(actingUserId, targetUserId, body);
            res.status(200).json({...updatedUser, password: undefined});
        } catch (error) {
            next(error);
        }
    }

    delete: Handler = async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const targetUserId = parseInt(req.params.id, 10); 
            const deletedUser = await this.usersService.deleteUser(targetUserId);
            res.status(200).json({ ...deletedUser, password: undefined });
        } catch (error) {
            next(error);
        }
    }
}