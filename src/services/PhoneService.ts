import { HttpError } from "../errors/HttpError";
import { CreatePhoneAttributes, IphoneRepository } from "../repositories/PhoneRepository";
import { IuserRepository } from "../repositories/UserRepository";
import { validateAndFormatPhoneE164, validateAndFormatPhoneInternational } from "./functions/phone";

export class PhoneService {
    constructor(
        private readonly phoneRepository: IphoneRepository,
        private readonly userRepository: IuserRepository
    ) { }

    async getUserPhones(userId: number) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const phones = await this.phoneRepository.findByUserIdPhone(userId)
        const formatedPhones = phones.map((phone) => {
            const numberPhone = validateAndFormatPhoneInternational(phone.phone_number)
            return {...phone, phone_number: numberPhone}
        })
        return formatedPhones
    }

    async createUserPhone(userId: number, params: CreatePhoneAttributes) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const newPhone = await this.phoneRepository.createPhone(userId, {...params, phone_number: validateAndFormatPhoneE164(params.phone_number)})
        newPhone.phone_number = validateAndFormatPhoneInternational(newPhone.phone_number)
        return newPhone
    }

    async updateUserPhone(userId: number, phoneId: number, params: Partial<CreatePhoneAttributes>) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new HttpError(404, "User not found");
        const phoneExists = await this.phoneRepository.findByUserIdPhoneId(userId, phoneId)
        if (!phoneExists) throw new HttpError(404, "Phone not found");
        let phoneValid 
        if (params.phone_number) {
            phoneValid = validateAndFormatPhoneE164(params.phone_number)
        } else {
            phoneValid = params?.phone_number
        }
        const updatedPhone = await this.phoneRepository.updateByIdPhone(userId, phoneId, {...params, phone_number: phoneValid})
        if (updatedPhone?.phone_number) updatedPhone.phone_number = validateAndFormatPhoneInternational(updatedPhone.phone_number)
        return updatedPhone
    }

    async deleteUserPhone(userId: number, phoneId: number) {
        const userExists = await this.userRepository.findById(userId);
        if (!userExists) throw new HttpError(404, "User not found");
        const phoneExists = await this.phoneRepository.findByUserIdPhoneId(userId, phoneId);
        if (!phoneExists) throw new HttpError(404, "Phone not found");
        const phoneDeleted = await this.phoneRepository.deleteByIdPhone(userId, phoneId);
        if (phoneDeleted?.phone_number) phoneDeleted.phone_number = validateAndFormatPhoneInternational(phoneDeleted.phone_number)
        return phoneDeleted
    }
}