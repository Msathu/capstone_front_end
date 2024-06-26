import axios from "axios";

export const registerApi = async (inputs) => {
    try {

        const endpoint = `${process.env.API_BASE_URL}/member/createMember`;

        const response = await axios.post(endpoint, {
            firstname: inputs.firstname,
            lastname: inputs.lastname,
            job: inputs.job,
            address: {
                streetAddress: inputs.streetAddress,
                city: inputs.city,
                state: inputs.state,
                country: inputs.country,
                postalCode: inputs.postalCode,
                apartmentNumber: inputs.apartmentNumber,
            },
            email:inputs.email,
            password:inputs.password,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });


        return response;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};
