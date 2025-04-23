import { categoriesAPI } from "./api";

const calendarService = {
  getTransactions: (params) => categoriesAPI.get("/calendar/transactions", { params }),
};

export default calendarService;