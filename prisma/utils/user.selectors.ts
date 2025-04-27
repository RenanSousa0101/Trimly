export const userWithFullAddressSelect = {
    id: true,
    name: true,
    email: true,
    bio: true,
    avatar_url: true,
    Phone: {
        select: {
            id: true,
            phone_number: true,
            phone_type: true,
            is_primary: true,
        }
    },
    Address: {
        select: {
            id: true,
            street: true,
            number: true,
            cep_street: true,
            complement: true,
            address_type: true,
            district: {
                select: {
                    id: true,
                    name: true,
                    city: {
                        select: {
                            id: true,
                            name: true,
                            state: {
                                select: {
                                    id: true,
                                    name: true,
                                    uf: true,
                                    country: {
                                        select: {
                                            id: true,
                                            name: true,
                                            acronym: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};