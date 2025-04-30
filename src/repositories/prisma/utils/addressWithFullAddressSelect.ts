export const addressWithFullAddressSelect = {
    id: true,
    street: true,
    number: true,
    cep_street: true,
    complement: true,
    address_type: true,
    district: {
        select: {
            name: true,
            city: {
                select: {
                    name: true,
                    state: {
                        select: {
                            name: true,
                            uf: true,
                            country: {
                                select: {
                                    name: true,
                                    acronym: true,
                                }
                            }
                        },
                    },
                },
            },
        },
    }
}