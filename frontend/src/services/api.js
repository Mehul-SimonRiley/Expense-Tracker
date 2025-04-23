// Base URL for API requests - adjust this to match your backend URL
const API_BASE_URL = "http://localhost:5000"

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add Authorization header if token is available
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Include credentials for cookies if your backend uses sessions
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Transactions API
export const transactionsAPI = {
  getAll: async (filters = {}) => {
    // Convert filters to query string
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
    return fetchAPI(`/transactions/${queryString}`)
  },
  getById: async (id) => {
    return fetchAPI(`/transaction/${id}`)
  },
  create: async (transactionData) => {
    return fetchAPI("/transactions", {
      method: "POST",
      body: JSON.stringify(transactionData),
    })
  },
  update: async (id, transactionData) => {
    return fetchAPI(`/transaction/${id}`, {
      method: "PUT",
      body: JSON.stringify(transactionData),
    })
  },
  delete: async (id) => {
    return fetchAPI(`/transaction/${id}`, {
      method: "DELETE",
    })
  },
}

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return fetchAPI("/categories/")
  },
  getById: async (id) => {
    return fetchAPI(`/category/${id}`)
  },
  create: async (categoryData) => {
    return fetchAPI("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    })
  },
  update: async (id, categoryData) => {
    return fetchAPI(`/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    })
  },
  delete: async (id) => {
    return fetchAPI(`/category/${id}`, {
      method: "DELETE",
    })
  },
}

// Budgets API
export const budgetsAPI = {
  getAll: async () => {
    return fetchAPI("/budgets")
  },
  getById: async (id) => {
    return fetchAPI(`/budget/${id}`)
  },
  create: async (budgetData) => {
    return fetchAPI("/budgets", {
      method: "POST",
      body: JSON.stringify(budgetData),
    })
  },
  update: async (id, budgetData) => {
    return fetchAPI(`/budget/${id}`, {
      method: "PUT",
      body: JSON.stringify(budgetData),
    })
  },
  delete: async (id) => {
    return fetchAPI(`/budget/${id}`, {
      method: "DELETE",
    })
  },
}

// Dashboard API
export const dashboardAPI = {
  getSummary: async () => {
    return fetchAPI("/dashboard/summary")
  },
  getRecentTransactions: async (limit = 5) => {
    return fetchAPI(`/transactions?limit=${limit}`)
  },
  getBudgetStatus: async () => {
    return fetchAPI("/budgets/status")
  },
  getCategoryBreakdown: async () => {
    return fetchAPI("/categories/breakdown")
  },
}

// Reports API
export const reportsAPI = {
  getExpenseVsIncome: async (timeRange) => {
    return fetchAPI(`/reports/expense-income?timeRange=${timeRange}`)
  },
  getCategoryBreakdown: async (timeRange) => {
    return fetchAPI(`/reports/category-breakdown?timeRange=${timeRange}`)
  },
  getSpendingTrends: async (timeRange) => {
    return fetchAPI(`/reports/spending-trends?timeRange=${timeRange}`)
  },
}

// User API
export const userAPI = {
  getProfile: async () => {
    return fetchAPI("/user/profile")
  },
  updateProfile: async (profileData) => {
    return fetchAPI("/user/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  },
  updateSettings: async (settingsData) => {
    return fetchAPI("/user/settings", {
      method: "PUT",
      body: JSON.stringify(settingsData),
    })
  },
}

// Settings Service
export const settingsService = {
  updateProfile: async (profileData) => {
    return fetchAPI("/settings/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
  updatePreferences: async (preferencesData) => {
    return fetchAPI("/settings/preferences", {
      method: "PUT",
      body: JSON.stringify(preferencesData),
    });
  },
  updateNotifications: async (notificationsData) => {
    return fetchAPI("/settings/notifications", {
      method: "PUT",
      body: JSON.stringify(notificationsData),
    });
  },
  createBackup: async () => {
    return fetchAPI("/settings/backup", {
      method: "POST",
    });
  },
  restoreBackup: async () => {
    return fetchAPI("/settings/restore", {
      method: "POST",
    });
  },
  deleteAccount: async () => {
    return fetchAPI("/settings/account", {
      method: "DELETE",
    });
  },
};
