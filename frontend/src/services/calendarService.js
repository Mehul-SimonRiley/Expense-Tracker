import { transactionsAPI } from './api';

export const getTransactions = async (startDate, endDate) => {
  return transactionsAPI.getAll({
    start_date: startDate,
    end_date: endDate
  });
};