import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post('http://localhost:5000/api/auth/refresh', {
          refresh_token: refreshToken
        });

        const { access_token } = response.data;
        localStorage.setItem('accessToken', access_token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Don't clear tokens or redirect - let the component handle the error
        return Promise.reject(error);
      }
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
      throw error
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
      console.error('Error fetching expense breakdown:', error)
      return []
    }
  },
}

// Budgets API
export const budgetsAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/budgets");
      const budgets = response.data || [];
      // Calculate current spending for each budget
      const budgetsWithSpending = await Promise.all(
        budgets.map(async (budget) => {
          const transactions = await transactionsAPI.getAll({
            category: budget.category_id,
            start_date: budget.start_date,
            end_date: budget.end_date
          });
          const spent = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);
          return {
            ...budget,
            spent,
            percentage: (spent / budget.amount) * 100
          };
        })
      );
      return budgetsWithSpending;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
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
    try {
      const response = await api.get('/dashboard/summary')
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
      throw error
    }
  },
  getRecentTransactions: async () => {
    try {
      const response = await api.get('/dashboard/recent-transactions')
      return response.data || []
    } catch (error) {
      console.error('Error fetching recent transactions:', error)
      return []
    }
  },
  getCategoryBreakdown: async () => {
    try {
      const response = await api.get('/dashboard/category-breakdown')
      return response.data || []
    } catch (error) {
      console.error('Error fetching category breakdown:', error)
      return []
    }
  },
  getBudgetStatus: async () => {
    try {
      const response = await api.get('/dashboard/budget-status')
      return response.data || []
    } catch (error) {
      console.error('Error fetching budget status:', error)
      return []
    }
  }
}

// Reports API
export const reportsAPI = {
  getExpenseVsIncome: async (timeRange) => {
    try {
      const response = await api.get(`/reports/income-vs-expense?timeRange=${timeRange}`)
      return response.data || {
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        savingsRate: 0,
        monthlyComparison: []
      }
    } catch (error) {
      console.error('Error fetching expense vs income report:', error)
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        savingsRate: 0,
        monthlyComparison: []
      }
    }
  },
  getCategoryBreakdown: async (timeRange) => {
    try {
      const response = await api.get(`/reports/spending-by-category?timeRange=${timeRange}`)
      return response.data || {
        topCategories: []
      }
    } catch (error) {
      console.error('Error fetching category breakdown report:', error)
      return {
        topCategories: []
      }
    }
  },
  getSpendingTrends: async (timeRange) => {
    try {
      const response = await api.get(`/reports/spending-trends?timeRange=${timeRange}`)
      return response.data || {
        monthlySpending: [],
        categoryTrends: []
      }
    } catch (error) {
      console.error('Error fetching spending trends report:', error)
      return {
        monthlySpending: [],
        categoryTrends: []
      }
    }
  }
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
    async getSettings() {
        try {
            const response = await api.get('/settings');
            return response.data;
        } catch (error) {
            console.error('Get settings error:', error);
            throw error;
        }
    },

    async updateProfile(data) {
        try {
            const response = await api.put('/settings/profile', data);
            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    async updatePreferences(data) {
        try {
            const response = await api.put('/settings/preferences', data);
            return response.data;
        } catch (error) {
            console.error('Update preferences error:', error);
            throw error;
        }
    },

    async updateNotifications(data) {
        try {
            const response = await api.put('/settings/notifications', data);
            return response.data;
        } catch (error) {
            console.error('Update notifications error:', error);
            throw error;
        }
    },

    createBackup: async () => {
        return api.post("/settings/backup");
    },

    restoreBackup: async () => {
        return api.post("/settings/restore");
    },

    async deleteAccount() {
        try {
            const response = await api.delete('/settings/account');
            return response.data;
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        }
    }
};

// Auth Service
export const authService = {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, refresh_token, user } = response.data;
            
            if (!user) {
                throw new Error('No user data received from server');
            }
            
            // Store tokens and user data
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update default auth header
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            return user;
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Login failed');
            }
            throw error;
        }
    },

    async register(name, email, password) {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Registration failed');
            }
            throw error;
        }
    },

    logout() {
        try {
            // Clear all auth data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            
            // Remove auth header
            delete api.defaults.headers.common['Authorization'];
            
            // Clear any other app state if needed
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    updateUser(userData) {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        }
    }
};

