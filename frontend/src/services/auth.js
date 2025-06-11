import api from './api';

export const authService = {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, refresh_token, user } = response.data;
            
            // Store tokens
            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            
            // Store user data
            this.updateUser(user);
            
            return { user };
        } catch (error) {
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            this.updateUser(null);
        }
    },

    async getCurrentUser() {
        try {
            const response = await api.get('/auth/profile');
            const user = response.data;
            this.updateUser(user);
            return user;
        } catch (error) {
            if (error.response?.status === 401) {
                this.logout();
            }
            throw error;
        }
    },

    updateUser(user) {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    },

    async updateProfile(profileData) {
        try {
            const response = await api.put('/settings/profile', profileData);
            const updatedUser = response.data.user;
            
            // Update localStorage with new user data
            this.updateUser(updatedUser);
            
            return { data: { user: updatedUser } };
        } catch (error) {
            throw error;
        }
    }
}; 