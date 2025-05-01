import { HttpError } from "../errors/HttpError";
import { CreateUserAttributes, IuserRepository, UserWhereParams } from "../repositories/UserRepository";

interface GetUsersWithPaginationParams {
    page?: number
    pageSize?: number
    name?: string
    sortBy?: "name"
    order?: "asc" | "desc"
}
export class UsersService {

    constructor(private readonly userRepository: IuserRepository) { }

    async getAllUsersPaginated(params: GetUsersWithPaginationParams) {
        const { name, page = 1, pageSize = 10, sortBy, order } = params

        const take = pageSize;
        const skip = (page - 1) * take;

        const where: UserWhereParams = {}

        if (name) where.name = { contains: name, mode: "insensitive" }

        const users = await this.userRepository.find({ where, sortBy, order, skip, take })
        const totalUsers = await this.userRepository.count(where)

        return {
            users,
            meta: {
                page,
                pageSize,
                total: totalUsers,
                totalPages: Math.ceil(totalUsers / pageSize)
            }
        }
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findById(id);
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
        return formattedUser
    }

    async createUser(params: CreateUserAttributes) {
        const userExists = await this.userRepository.findByEmail(params.email)
        if (userExists) throw new HttpError(409, "User already exists");
        const newUser = await this.userRepository.create(params);
        return newUser
    }

    async updateUser(userId: number, params: Partial<CreateUserAttributes>) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const updatedUser = await this.userRepository.updateById(userId, params)
        return updatedUser
    }

    async deleteUser(userId: number) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const deletedUser = await this.userRepository.deleteById(userId)
        return deletedUser
    }
}