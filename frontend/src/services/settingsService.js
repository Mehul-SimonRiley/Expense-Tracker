import api from "./api";

const settingsService = {
  updateProfile: (data) => api.put("/settings/profile", data),
  updatePreferences: (data) => api.put("/settings/preferences", data),
  updateNotifications: (data) => api.put("/settings/notifications", data),
  createBackup: () => api.post("/settings/backup"),
  restoreBackup: () => api.post("/settings/restore"),
  deleteAccount: () => api.delete("/settings/account"),
};

export default settingsService;