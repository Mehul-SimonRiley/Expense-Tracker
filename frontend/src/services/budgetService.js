import { budgetsAPI } from "./api";

const budgetService = {
  getAll: () => budgetsAPI.get("/dashboard/budget-status"),
};

export default budgetService;