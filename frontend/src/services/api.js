// Base API URL - change this to your Flask backend URL
const API_BASE_URL = "http://localhost:5000/api"

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add auth token if available
  const token = localStorage.getItem("auth_token")
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, config)

    // Handle unauthorized responses
    if (response.status === 401) {
      localStorage.removeItem("auth_token")
      window.location.href = "/"
      return null
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    return data
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (response && response.token) {
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }

    return response
  },

  register: async (userData) => {
    return fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  logout: () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },
}

// Transaction services
export const transactionService = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return fetchAPI(`/transactions?${queryParams}`)
  },

  getById: (id) => {
    return fetchAPI(`/transactions/${id}`)
  },

  create: (transaction) => {
    return fetchAPI("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    })
  },

  update: (id, transaction) => {
    return fetchAPI(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transaction),
    })
  },

  delete: (id) => {
    return fetchAPI(`/transactions/${id}`, {
      method: "DELETE",
    })
  },
}

// Category services
export const categoryService = {
  getAll: () => {
    return fetchAPI("/categories")
  },

  create: (category) => {
    return fetchAPI("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    })
  },

  update: (id, category) => {
    return fetchAPI(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    })
  },

  delete: (id) => {
    return fetchAPI(`/categories/${id}`, {
      method: "DELETE",
    })
  },
}

// Budget services
export const budgetService = {
  getAll: () => {
    return fetchAPI("/budgets")
  },

  create: (budget) => {
    return fetchAPI("/budgets", {
      method: "POST",
      body: JSON.stringify(budget),
    })
  },

  update: (id, budget) => {
    return fetchAPI(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(budget),
    })
  },

  delete: (id) => {
    return fetchAPI(`/budgets/${id}`, {
      method: "DELETE",
    })
  },
}

// Dashboard services
export const dashboardService = {
  getSummary: () => {
    return fetchAPI("/dashboard/summary")
  },

  getRecentTransactions: () => {
    return fetchAPI("/dashboard/recent-transactions")
  },

  getCategoryBreakdown: () => {
    return fetchAPI("/dashboard/category-breakdown")
  },

  getBudgetStatus: () => {
    return fetchAPI("/dashboard/budget-status")
  },
}

// Reports services
export const reportService = {
  getExpenseVsIncome: (timeRange) => {
    return fetchAPI(`/reports/expense-vs-income?timeRange=${timeRange}`)
  },

  getCategoryBreakdown: (timeRange) => {
    return fetchAPI(`/reports/category-breakdown?timeRange=${timeRange}`)
  },

  getSpendingTrends: (timeRange) => {
    return fetchAPI(`/reports/spending-trends?timeRange=${timeRange}`)
  },
}
