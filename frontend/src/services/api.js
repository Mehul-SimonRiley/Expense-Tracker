const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

// Helper function to make API calls
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem("token"); // Replace with your token storage logic
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
}

// Dashboard services
export const dashboardService = {
  getSummary: () => fetchAPI("/dashboard/summary"),
  getRecentTransactions: () => fetchAPI("/dashboard/recent-transactions"),
  getCategoryBreakdown: () => fetchAPI("/dashboard/category-breakdown"),
};

// Transactions services
export const transactionService = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return fetchAPI(`/transactions?${queryParams}`);
  },
  create: (transaction) => fetchAPI("/transactions", { method: "POST", body: JSON.stringify(transaction) }),
  update: (id, transaction) => fetchAPI(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(transaction) }),
  delete: (id) => fetchAPI(`/transactions/${id}`, { method: "DELETE" }),
};

// Categories services
export const categoryService = {
  getAll: () => fetchAPI("/categories"),
};

// Budgets services
export const budgetService = {
  getAll: () => fetchAPI("/dashboard/budget-status"),
};