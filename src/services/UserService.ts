import { HttpError } from "../errors/HttpError";
import { CreateUserAttributes, IuserRepository, UserWhereParams } from "../repositories/UserRepository";
import { IrolesRepository } from "../repositories/RolesRepository"; 

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
            throw new HttpError(404, "User not found");
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
        const role = await this.rolesRepository.findByRoleType("Client")
        if(!role) throw new HttpError(404, "Role not found!")
        const newUser = await this.userRepository.create(role.id, params);
        return newUser;
    }

    async updateUser(actingUserId: number, userId: number, params: Partial<CreateUserAttributes>) {
        const actingUserRoles = await this.rolesRepository.findByUserIdRoles(actingUserId);
        const safeActingUserRoles = actingUserRoles || [];
        const actingUserIsAdmin = safeActingUserRoles.some(assignment => assignment.roles.role_type === "Admin");

        let finalParams: Partial<CreateUserAttributes> = {};

        let canUpdate = false;

        if (actingUserIsAdmin) {
            canUpdate = true;
        }
        
        else if (actingUserId === userId) {
            canUpdate = true;
            const allowedFields: Array<keyof CreateUserAttributes> = ['name', 'avatar_url', 'bio', 'password'];
            const receivedFields = Object.keys(params) as Array<keyof Partial<CreateUserAttributes>>;

            const containsDisallowedFields = receivedFields.some(field =>
                !allowedFields.includes(field as keyof CreateUserAttributes)
            );

            if (containsDisallowedFields) {
                throw new HttpError(403, `Permission denied. You can only update your own: ${allowedFields.join(', ')}`);
            }

            finalParams = params; 
        }

        if (!canUpdate) {
            throw new HttpError(403, "Permission denied. You can only update your own profile or be an Admin to update others.");
        }
        
        const userExists = await this.userRepository.findById(userId);
        if (!userExists) {
            throw new HttpError(404, "User not found"); 
        }

        const updatedUser = await this.userRepository.updateById(userId, finalParams);

        return updatedUser;
    }

    
    async deleteUser(actingUserId: number, userId: number) {
        
        const actingUserRoles = await this.rolesRepository.findByUserIdRoles(actingUserId);
        const safeActingUserRoles = actingUserRoles || [];
        const actingUserIsAdmin = safeActingUserRoles.some(assignment => assignment.roles.role_type === "Admin");

        let canDelete = false;

        if (actingUserIsAdmin) {
            canDelete = true;
        }
        
        if (actingUserId === userId) {
             throw new HttpError(403, "Permission denied. You cannot delete your own account.");
        }

        if (!canDelete) { 
             throw new HttpError(403, "Permission denied. Only Admin users can delete other users.");
        }
        
        const userExists = await this.userRepository.findById(userId);
        if (!userExists) {
            throw new HttpError(404, "User not found"); 
        }

        const deletedUser = await this.userRepository.deleteById(userId);

        return deletedUser;
    }
}