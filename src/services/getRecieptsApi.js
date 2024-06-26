import axios from "axios";
import { getAccessToken } from "./Storage"; 

export const getReciepts = async () => {
    try {

        const endpoint = `${process.env.API_BASE_URL}/reciept/member/getReciepts`;
        const token = getAccessToken();
        const response = await axios.get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};