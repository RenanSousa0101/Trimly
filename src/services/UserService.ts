import { HttpError } from "../errors/HttpError";
import { CreateUserAttributes, IuserRepository, UserWhereParams } from "../repositories/UserRepository";
import { IrolesRepository } from "../repositories/RolesRepository";
import bcrypt from "bcrypt";

interface GetUsersWithPaginationParams {
    page?: number
    pageSize?: number
    name?: string
    sortBy?: "name"
    order?: "asc" | "desc"
}

export class UsersService {

    constructor(
        private readonly userRepository: IuserRepository,
        private readonly rolesRepository: IrolesRepository
    ) { }

    async getAllUsersPaginated(params: GetUsersWithPaginationParams) {
        const { name, page = 1, pageSize = 10, sortBy, order } = params;

        const take = pageSize;
        const skip = (page - 1) * take;

        const where: UserWhereParams = {};

        if (name) {
            where.name = { contains: name, mode: "insensitive" };
        }

        const users = await this.userRepository.find({ where, sortBy, order, skip, take });
        const totalUsers = await this.userRepository.count(where);

        return {
            users,
            meta: {
                page,
                pageSize,
                total: totalUsers,
                totalPages: Math.ceil(totalUsers / pageSize)
            }
        };
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new HttpError(404, "User not found")
        }

        const formattedUser = {
            id: user.id,
            roles: user.User_Roles ? user.User_Roles.map((role) => role.roles.role_type) : [],
            name: user.name,
            email: user.email,
            avatar_url: user.avatar_url,
            bio: user.bio,
            phones: user.Phone ? user.Phone.map((phone) => ({
                id: phone.id,
                phone_type: phone.phone_type,
                phone_number: phone.phone_number,
                is_primary: phone.is_primary,
            })) : [],
            address: user.Address ? user.Address.map((address) => ({
                id: address.id,
                type: address.address_type,
                country: address.district?.city?.state?.country?.name || null,
                acronym: address.district?.city?.state?.country?.acronym || null,
                state: address.district?.city?.state?.name || null,
                uf: address.district?.city?.state?.uf || null,
                district: address.district?.name || null,
                city: address.district?.city?.name || null,
                street: address.street,
                number: address.number,
                cep: address.cep_street,
                complement: address.complement,
            })) : [],
        };
        return formattedUser;
    }

    async createUser(params: CreateUserAttributes) {

        const userExists = await this.userRepository.findByEmail(params.email);
        if (userExists) {
            throw new HttpError(409, "User already exists");
        }

        const role = await this.rolesRepository.findByRoleType("Client");
        if (!role) {

            throw new HttpError(500, "Default 'Client' role not found!")
        }

        const newUser = await this.userRepository.create(role.id, params);

        return newUser
    }

    async updateUser(actingUserId: number, userId: number, params: Partial<CreateUserAttributes>) {

        const actingUserRoles = await this.rolesRepository.findByUserIdRoles(actingUserId);
        const safeActingUserRoles = actingUserRoles || [];
        const actingUserIsAdmin = safeActingUserRoles.some(assignment => assignment.roles.role_type === "Admin");

        let finalParams: Partial<CreateUserAttributes> = {};

        if (actingUserIsAdmin) {
            finalParams = params;
        } else {

            const fieldsAllowedForRegularUser: Array<keyof CreateUserAttributes> = ['name', 'avatar_url', 'bio'];
            const receivedFields = Object.keys(params) as Array<keyof Partial<CreateUserAttributes>>;

            const containsDisallowedFields = receivedFields.some(field =>
                !fieldsAllowedForRegularUser.includes(field as keyof CreateUserAttributes)
            );

            if (containsDisallowedFields) {
                throw new HttpError(403, `Permission denied. You can only update your own: ${fieldsAllowedForRegularUser.join(', ')}`);
            }

            finalParams = params
        }

        const receivedAnyValidParams = Object.keys(finalParams).length > 0;

        if (!receivedAnyValidParams) {

            const receivedAnyParamsAtAll = Object.keys(params).length > 0;
            if (receivedAnyParamsAtAll && !actingUserIsAdmin) {
                const fieldsAllowedForRegularUser: Array<keyof CreateUserAttributes> = ['name', 'avatar_url', 'bio', 'password']
                throw new HttpError(400, `No allowed fields provided for update. You can only update your own: ${fieldsAllowedForRegularUser.join(', ')}`)
            }

            const userExists = await this.userRepository.findById(userId)
            if (!userExists) {
                throw new HttpError(404, "Target user not found");
            }
            return userExists
        }

        const userExists = await this.userRepository.findById(userId);
        if (!userExists) {
            throw new HttpError(404, "Target user not found");
        }

        if (finalParams.password) {
            finalParams.password = await bcrypt.hash(finalParams.password, 10);
        }

        const updatedUser = await this.userRepository.updateById(userId, finalParams);

        return updatedUser
    }


    async deleteUser(userId: number) {

        const userExists = await this.userRepository.findById(userId);
        if (!userExists) {
            throw new HttpError(404, "Target user not found");
        }
        const deletedUser = await this.userRepository.deleteById(userId);
        return deletedUser
    }
}
