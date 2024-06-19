import axios from "axios";

export const registerApi = async (inputs) => {
    try {

        const endpoint = `http://localhost:3000/member/createMember`;

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

        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};