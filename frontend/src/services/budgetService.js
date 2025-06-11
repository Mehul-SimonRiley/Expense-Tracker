import { budgetsAPI } from "./api";

const budgetService = {
  getAll: () => budgetsAPI.get("/api/dashboard/budget-status"),
};

export default budgetService;