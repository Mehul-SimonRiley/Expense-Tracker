import api from './api';

export const authService = {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user } = response.data;
            
            // Store both token and user data
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            const { access_token, user } = response.data;
            
            // Store both token and user data
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage on logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    async getCurrentUser() {
        try {
            // First try to get from localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                return JSON.parse(storedUser);
            }

            // If not in localStorage, fetch from API
            const response = await api.get('/users/profile');
            const user = response.data;
            
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(user));
            
            return user;
        } catch (error) {
            // If there's an error, clear potentially invalid data
            localStorage.removeItem('user');
            throw error;
        }
    },

    updateUser(userData) {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        }
    },

    async updateProfile(profileData) {
        try {
            const response = await api.put('/users/profile', profileData);
            const updatedUser = response.data;
            
            // Update localStorage with new user data
            this.updateUser(updatedUser);
            
            return { data: { user: updatedUser } };
        } catch (error) {
            throw error;
        }
    }
}; 