import { reportsAPI } from './api';

export const getExpenseVsIncome = async (timeRange) => {
  return reportsAPI.getExpenseVsIncome(timeRange);
};

export const getCategoryBreakdown = async (timeRange) => {
  return reportsAPI.getCategoryBreakdown(timeRange);
};

export const getSpendingTrends = async (timeRange) => {
  return reportsAPI.getSpendingTrends(timeRange);
};