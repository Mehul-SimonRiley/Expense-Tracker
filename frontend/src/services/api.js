import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to add the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Don't reload the page, just redirect to login
      window.location.href = '/';
      return Promise.reject(new Error("Unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;

// Transactions API
export const transactionsAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
    return api.get(`/transactions${queryString}`)
  },
  getById: async (id) => {
    return api.get(`/transactions/${id}`)
  },
  create: async (transactionData) => {
    return api.post("/transactions", transactionData)
  },
  update: async (id, transactionData) => {
    return api.put(`/transactions/${id}`, transactionData)
  },
  delete: async (id) => {
    return api.delete(`/transactions/${id}`)
  },
}

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return api.get("/categories")
  },
  getById: async (id) => {
    return api.get(`/categories/${id}`)
  },
  create: async (categoryData) => {
    return api.post("/categories", categoryData)
  },
  update: async (id, categoryData) => {
    return api.put(`/categories/${id}`, categoryData)
  },
  delete: async (id) => {
    return api.delete(`/categories/${id}`)
  },
}

// Budgets API
export const budgetsAPI = {
  getAll: async () => {
    return api.get("/budgets")
  },
  getById: async (id) => {
    return api.get(`/budgets/${id}`)
  },
  create: async (budgetData) => {
    return api.post("/budgets", budgetData)
  },
  update: async (id, budgetData) => {
    return api.put(`/budgets/${id}`, budgetData)
  },
  delete: async (id) => {
    return api.delete(`/budgets/${id}`)
  },
}

// Dashboard API
export const dashboardAPI = {
  getSummary: async () => {
    return api.get("/dashboard/summary")
  },
  getRecentTransactions: async (limit = 5) => {
    return api.get(`/dashboard/recent-transactions?limit=${limit}`)
  },
  getBudgetStatus: async () => {
    return api.get("/dashboard/budget-status")
  },
  getCategoryBreakdown: async () => {
    return api.get("/dashboard/category-breakdown")
  },
}

// Reports API
export const reportsAPI = {
  getExpenseVsIncome: async (timeRange) => {
    return api.get(`/reports/expense-income?timeRange=${timeRange}`)
  },
  getCategoryBreakdown: async (timeRange) => {
    return api.get(`/reports/category-breakdown?timeRange=${timeRange}`)
  },
  getSpendingTrends: async (timeRange) => {
    return api.get(`/reports/spending-trends?timeRange=${timeRange}`)
  },
}

// User API
export const userAPI = {
  getProfile: async () => {
    return api.get("/user/profile")
  },
  updateProfile: async (profileData) => {
    return api.put("/user/profile", profileData)
  },
  updateSettings: async (settingsData) => {
    return api.put("/user/settings", settingsData)
  },
}

// Settings Service
export const settingsService = {
  updateProfile: async (profileData) => {
    return api.put("/settings/profile", profileData);
  },
  updatePreferences: async (preferencesData) => {
    return api.put("/settings/preferences", preferencesData);
  },
  updateNotifications: async (notificationsData) => {
    return api.put("/settings/notifications", notificationsData);
  },
  createBackup: async () => {
    return api.post("/settings/backup");
  },
  restoreBackup: async () => {
    return api.post("/settings/restore");
  },
  deleteAccount: async () => {
    return api.delete("/settings/account");
  },
};
