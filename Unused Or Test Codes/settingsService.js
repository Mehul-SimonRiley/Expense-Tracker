import api from './api';

const settingsService = {
    // Get all settings
    async getSettings() {
        try {
            const response = await api.get('/api/settings');
            return response.data;
        } catch (error) {
            console.error('Error fetching settings:', error);
            throw error;
        }
    },

    // Update profile settings
    async updateProfile(data) {
        try {
            const response = await api.put('/api/settings/profile', data);
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    // Update security settings
    async updateSecurity(data) {
        try {
            const response = await api.put('/api/settings/security', data);
            return response.data;
        } catch (error) {
            console.error('Error updating security settings:', error);
            throw error;
        }
    },

    // Update preferences
    async updatePreferences(data) {
        try {
            const response = await api.put('/api/settings/preferences', data);
            return response.data;
        } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    },

    // Update currency settings
    async updateCurrency(data) {
        try {
            const response = await api.put('/api/settings/currency', data);
            return response.data;
        } catch (error) {
            console.error('Error updating currency settings:', error);
            throw error;
        }
    },

    // Update notification settings
    async updateNotifications(data) {
        try {
            const response = await api.put('/api/settings/notifications', data);
            return response.data;
        } catch (error) {
            console.error('Error updating notification settings:', error);
            throw error;
        }
    },

    // Upload profile picture
    async uploadProfilePicture(file) {
        try {
            const formData = new FormData();
            formData.append('profile_picture', file);
            
            const response = await api.post('/api/settings/profile/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            throw error;
        }
    },

    // Delete account
    async deleteAccount() {
        try {
            const response = await api.delete('/api/settings/account');
            return response.data;
        } catch (error) {
            console.error('Error deleting account:', error);
            throw error;
        }
    }
};

export default settingsService; 