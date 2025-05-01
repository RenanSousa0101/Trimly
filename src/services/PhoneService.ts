import { HttpError } from "../errors/HttpError";
import { CreatePhoneAttributes, IphoneRepository } from "../repositories/PhoneRepository";
import { IuserRepository } from "../repositories/UserRepository";

export class PhoneService {
    constructor(
        private readonly phoneRepository: IphoneRepository,
        private readonly userRepository: IuserRepository
    ) { }

    async getUserPhones(userId: number) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const phones = await this.phoneRepository.findByUserIdPhone(userId)
        return phones
    }

    async createUserPhone(userId: number, params: CreatePhoneAttributes) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const newPhone = await this.phoneRepository.createPhone(userId, params)
        return newPhone
    }

    async updateUserPhone(userId: number, phoneId: number, params: Partial<CreatePhoneAttributes>) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const phoneExists = await this.phoneRepository.findByUserIdPhoneId(userId, phoneId)
        if (!phoneExists) throw new HttpError(404, "Phone not found");
        const updatedPhone = await this.phoneRepository.updateByIdPhone(userId, phoneId, params)
        return updatedPhone
    }

    async deleteUserPhone(userId: number, phoneId: number) {
        const userExists = await this.userRepository.findById(userId);
        if (!userExists) throw new HttpError(404, "User not found");
        const phoneExists = await this.phoneRepository.findByUserIdPhoneId(userId, phoneId);
        if (!phoneExists) throw new HttpError(404, "Phone not found");
        const userDeleted = await this.phoneRepository.deleteByIdPhone(userId, phoneId);
        return userDeleted
    }
}