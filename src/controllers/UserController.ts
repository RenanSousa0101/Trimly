import { Handler } from "express";
import { CreateUserRequestSchema, GetUserRequestSchema, UpdateUserRequestSchema } from "./schemas/UserRequestSchemas";
import { HttpError } from "../errors/HttpError";
import { IuserRepository, UserWhereParams } from "../repositories/UserRepository";

export class UserController {

    private userRepository: IuserRepository;
    
    constructor(userRepository: IuserRepository) {
        this.userRepository = userRepository
    }

    // SHOW ALL /users
    index: Handler = async (req, res, next) => {
       try {
            const query = GetUserRequestSchema.parse(req.query);
            const { page = "1", pageSize = "10", name, sortBy = "name", order = "asc"} = query;
            const take = Number(pageSize);
            const skip = (Number(page) - 1) * take;
            const where: UserWhereParams = {}
            if (name) where.name = { contains: name, mode: "insensitive" }
            const users = await this.userRepository.find({ where, sortBy, order, skip, take })
            const totalUsers = await this.userRepository.count(where)
            res.status(200).json({
                data: users,
                meta: {
                    page: Number(page),
                    pageSize: take,
                    total: totalUsers,
                    totalPages: Math.ceil(totalUsers / take)
                }
            });
       } catch (error) {
            next(error);
       } 
    }
    // CREATE /users
    create: Handler = async (req, res, next) => {
        try {
            const body = CreateUserRequestSchema.parse(req.body);
            const userExists = await this.userRepository.findByEmail(body.email)
            if (userExists) throw new HttpError(409, "User already exists");
            const newUser = await this.userRepository.create(body);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }
    // SHOW ONE /users/:id
    show: Handler = async (req, res, next) => {
        try {
            const user = await this.userRepository.findById(Number(req.params.id));
            if (!user) throw new HttpError(404, "User not found");
            const formattedUser = {
                id: user.id,
                roles: user.User_Roles.map((role) => role.roles.role_type),
                name: user.name,
                email: user.email,
                avatar_url: user.avatar_url,
                bio: user.bio,
                phones: user.Phone.map((phone) => ({
                    id: phone.id,
                    phone_type: phone.phone_type,
                    phone_number: phone.phone_number,
                    is_primary: phone.is_primary,
                })),
                address: user.Address.map((address) => ({
                    id: address.id,
                    type: address.address_type,
                    country: address.district.city.state.country.name,
                    acronym: address.district.city.state.country.acronym,
                    state: address.district.city.state.name,
                    uf: address.district.city.state.uf,
                    district: address.district.name,
                    city: address.district.city.name,
                    street: address.street,
                    number: address.number,
                    cep: address.cep_street,
                    complement: address.complement,
                })),
           }
            res.status(200).json(formattedUser);
        } catch (error) {
            next(error);
        }
    }
    // UPDATE /users/:id
    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const body = UpdateUserRequestSchema.parse(req.body)
            const userExists = await this.userRepository.findById(id)
            if (!userExists) throw new HttpError(404, "User not found");
            const updatedUser = await this.userRepository.updateById(id, body)
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
    // DELETE /users/:id
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const userExists = await this.userRepository.findById(id)
            if (!userExists) throw new HttpError(404, "User not found");
            const deletedUser = await this.userRepository.deleteById(id)
            res.status(200).json({ deletedUser })
        } catch (error) {
            next(error); 
        }
    }
}