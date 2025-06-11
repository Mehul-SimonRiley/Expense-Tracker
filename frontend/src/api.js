import axios from 'axios';

const API_URL = '/api'; // Update this with your backend URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token); // Debug log
    
    if (token) {
        // Ensure the token is properly formatted
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        config.headers.Authorization = formattedToken;
        console.log('Request headers:', config.headers); // Debug log
    } else {
        console.log('No token found in localStorage'); // Debug log
    }
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status, response.config.url); // Debug log
        return response;
    },
    async (error) => {
        console.log('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
            headers: error.config?.headers
        }); // Debug log
        
        const originalRequest = error.config;
        
        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Attempting to refresh token...'); // Debug log
            originalRequest._retry = true;
            
            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    console.log('No refresh token available'); // Debug log
                    // Instead of logging out, throw the error
                    return Promise.reject(error);
                }
                
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refresh_token: refreshToken
                });
                
                const { access_token } = response.data;
                console.log('Token refreshed successfully'); // Debug log
                localStorage.setItem('token', access_token);
                
                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.log('Token refresh failed:', refreshError); // Debug log
                // Instead of logging out, throw the error
                return Promise.reject(error);
            }
        }
        
        return Promise.reject(error);
    }
);

export const auth = {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, refresh_token, user } = response.data;
            console.log('Login successful, storing tokens'); // Debug log
            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('user', JSON.stringify(user));
            return response.data;
        } catch (error) {
            console.error('Login error:', error); // Debug log
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
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
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