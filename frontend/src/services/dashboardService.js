// frontend/src/services/dashboardService.js

import { fetchAPI } from "./api";

// Fetch dashboard summary
export const getSummary = async () => {
  return fetchAPI("/dashboard/summary");
};

// Fetch budget status
export const getBudgetStatus = async () => {
  return fetchAPI("/dashboard/budget-status");
};

// Fetch recent transactions (limit is optional)
export const getRecentTransactions = async (limit = 5) => {
  return fetchAPI(`/dashboard/recent-transactions?limit=${limit}`);
};

// Fetch category breakdown
export const getCategoryBreakdown = async () => {
  return fetchAPI("/dashboard/category-breakdown");
};

const dashboardService = {
  getSummary,
  getBudgetStatus,
  getRecentTransactions,
  getCategoryBreakdown,
};

export default dashboardService;