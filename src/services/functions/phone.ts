import parsePhoneNumberFromString, { PhoneNumber } from "libphonenumber-js";
import { HttpError } from "../../errors/HttpError";


export function isPhoneValid(number: string) {
    if (number !== undefined && number !== null) { 

        const phoneNumber = parsePhoneNumberFromString(number, 'BR'); // Ou undefined para inferir

        if (!phoneNumber || !phoneNumber.isValid()) {
            throw new HttpError(400, "Invalid phone number format or value.");
        }

        const numberFormat = phoneNumber.format('E.164');
        return numberFormat
    } else {
        throw new HttpError(400, "Invalid phone");
    }
}

export function phoneFormated(number: string) {
    if (number !== undefined && number !== null) { 
        const phoneNumber = parsePhoneNumberFromString(number, 'BR');

        if (!phoneNumber || !phoneNumber.isValid()) {
            throw new HttpError(400, "Invalid phone number format or value.");
        }

        const numberFormat = phoneNumber.format('INTERNATIONAL');
        return numberFormat
    } else {
        throw new HttpError(400, "Invalid phone");
    }
}