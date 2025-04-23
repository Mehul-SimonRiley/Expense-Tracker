import { reportsAPI } from "./api";

const reportsService = {
  getExpenseVsIncome: () => reportsAPI.get("/reports/expense-vs-income"),
  getCategoryBreakdown: () => reportsAPI.get("/reports/category-breakdown"),
  getSpendingTrends: () => reportsAPI.get("/reports/spending-trends"),
};

export default reportsService;