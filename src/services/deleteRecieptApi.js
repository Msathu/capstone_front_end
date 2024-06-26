import axios from "axios";
import { getAccessToken } from "./Storage"; 

export const deleteReciept = async (inputs) => {
    try {

        const endpoint = `${process.env.API_BASE_URL}/reciept/member/deleteReciept`;
        const token = getAccessToken();
        const response = await axios.post(endpoint,inputs, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        return response;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};