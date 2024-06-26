import axios from "axios";

export const loginApi = async (inputs) => {
    try {

        const endpoint = `${process.env.API_BASE_URL}/member/login`;

        const response = await axios.post(endpoint, {
            email:inputs.email,
            hashed_password:inputs.password,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};
