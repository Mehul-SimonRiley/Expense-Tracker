import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
    async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Registration failed' };
        }
    }

    async verifyEmail(email, code) {
        try {
            const response = await axios.post(`${API_URL}/auth/verify-email`, { email, code });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Email verification failed' };
        }
    }

    async resendVerification(email) {
        try {
            const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to resend verification' };
        }
    }

    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (response.data.access_token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    async refreshToken() {
        try {
            const user = this.getCurrentUser();
            if (!user?.refresh_token) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
                headers: {
                    'Authorization': `Bearer ${user.refresh_token}`
                }
            });

            if (response.data.access_token) {
                const updatedUser = {
                    ...user,
                    access_token: response.data.access_token
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return updatedUser;
            }
        } catch (error) {
            this.logout();
            throw error.response?.data || { error: 'Token refresh failed' };
        }
    }
}

export default new AuthService(); 