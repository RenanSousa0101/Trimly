import { HttpError } from "../errors/HttpError";
import { CreateAddressAttributes, IaddressRepository } from "../repositories/AddressRepository";
import { IuserRepository } from "../repositories/UserRepository";

export class AddressService {

    constructor(
        private readonly addressRepository: IaddressRepository,
        private readonly userRepository: IuserRepository
    ) { }

    async getUserAddress(userId: number) {
        const userExists = await this.userRepository.findById(userId);
        if (!userExists) throw new HttpError(404, "User not found");
        const addresses = await this.addressRepository.findByUserIdAddress(userId);
        const formattedAddresses = addresses.map((address) => ({
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
        }));
        return formattedAddresses
    }

    async createUserAddress(userId: number, params: CreateAddressAttributes) {
        const userExists = await this.userRepository.findById(userId);
        if (!userExists) throw new HttpError(404, "User not found");
        const newAddress = await this.addressRepository.createAddress(userId, params);
        return newAddress
    }

    async updateUserAddress(userId: number, addressId: number, params: Partial<CreateAddressAttributes>) {
        const userExists = await this.userRepository.findById(userId);
        if (!userExists) throw new HttpError(404, "User not found");
        const addressExists = await this.addressRepository.findByUserIdAddressId(userId, addressId);
        if (!addressExists) throw new HttpError(404, "Address not found");
        const updatedAddress = await this.addressRepository.updateByIdAddress(userId, addressId, params);
        return updatedAddress
    }

    async deleteUserAddress(userId: number, addressId: number) {
        const userExists = await this.userRepository.findById(userId);
        if (!userExists) throw new HttpError(404, "User not found");
        const addressExists = await this.addressRepository.findByUserIdAddressId(userId, addressId);
        if (!addressExists) throw new HttpError(404, "Address not found");
        const deletedAddress = await this.addressRepository.deleteByIdAddress(userId, addressId);
        return deletedAddress
    }
}