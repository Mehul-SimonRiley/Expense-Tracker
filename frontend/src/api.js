import axios from 'axios';

const API_URL = '/api'; // Update this with your backend URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async logout() {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    async getCurrentUser() {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default api; 