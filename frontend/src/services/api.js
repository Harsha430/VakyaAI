import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // explicit IP to avoid localhost issues

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

export const analyzePitch = async (pitchText) => {
    try {
        const response = await api.post('/analyze', { pitch_text: pitchText });
        return response.data;
    } catch (error) {
        console.error("API Error Analyzing Pitch:", error);
        throw error;
    }
};

export const getAnalysis = async (id) => {
    try {
        const response = await api.get(`/analysis/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error Fetching Analysis:", error);
        throw error;
    }
};

export default api;
