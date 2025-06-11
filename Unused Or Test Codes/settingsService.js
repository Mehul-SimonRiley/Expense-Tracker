import api from "./api";

const settingsService = {
  updateProfile: (data) => api.put("/api/settings/profile", data),
  updatePreferences: (data) => api.put("/api/settings/preferences", data),
  updateNotifications: (data) => api.put("/api/settings/notifications", data),
  uploadProfilePicture: (formData) => api.post("/api/settings/profile/picture", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  createBackup: () => api.post("/api/settings/backup"),
  restoreBackup: () => api.post("/api/settings/restore"),
  deleteAccount: () => api.delete("/api/settings/account"),
};

export default settingsService;