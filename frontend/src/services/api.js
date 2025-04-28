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
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await api.post('/auth/refresh');
        const { access_token } = response.data;
        
        // Store the new token
        localStorage.setItem('token', access_token);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 422) {
      console.error("Validation error:", error.response.data);
      return Promise.reject(error);
    } else if (error.response?.status === 429) {
      // Handle rate limit error
      console.warn("Rate limit exceeded. Please wait a moment before trying again.");
      return Promise.reject(new Error("Rate limit exceeded. Please wait a moment before trying again."));
    }
    return Promise.reject(error);
  }
);

export default api;

// Transactions API
export const transactionsAPI = {
  getAll: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
      const response = await api.get(`/transactions${queryString}`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return []
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching transaction:', error)
      throw error
    }
  },
  create: async (transactionData) => {
    try {
      const response = await api.post("/transactions", transactionData)
      return response.data
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw error
    }
  },
  update: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData)
      return response.data
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw error
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/transactions/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  },
}

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/categories')
      return response.data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },
  getById: async (id) => {
    return api.get(`/categories/${id}`)
  },
  create: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData)
      return response.data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData)
      return response.data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/categories/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  },
  getExpenseBreakdown: async () => {
    try {
      const response = await api.get('/categories/breakdown')
      return response.data || []
    } catch (error) {
      console.error('Error fetching category expense breakdown:', error)
      return []
    }
  }
}

// Budgets API
export const budgetsAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/budgets")
      return response.data || []
    } catch (error) {
      console.error('Error fetching budgets:', error)
      return []
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/budgets/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching budget:', error)
      throw error
    }
  },
  create: async (budgetData) => {
    try {
      const response = await api.post("/budgets", budgetData)
      return response.data
    } catch (error) {
      console.error('Error creating budget:', error)
      throw error
    }
  },
  update: async (id, budgetData) => {
    try {
      const response = await api.put(`/budgets/${id}`, budgetData)
      return response.data
    } catch (error) {
      console.error('Error updating budget:', error)
      throw error
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/budgets/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting budget:', error)
      throw error
    }
  }
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
    return api.get(`/reports/income-vs-expense?timeRange=${timeRange}`)
  },
  getCategoryBreakdown: async (timeRange) => {
    return api.get(`/reports/spending-by-category?timeRange=${timeRange}`)
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
