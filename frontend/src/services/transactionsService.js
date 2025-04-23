// frontend/src/services/transactionsAPI.js

import { fetchAPI } from "./api";

// Get all transactions (optionally with filters)
export const getAll = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  return fetchAPI(`/transactions/${queryString}`);
};

// Get a transaction by ID
export const getById = async (id) => {
  return fetchAPI(`/transaction/${id}`);
};

// Create a new transaction
export const create = async (transactionData) => {
  return fetchAPI("/transactions", {
    method: "POST",
    body: JSON.stringify(transactionData),
  });
};

// Update a transaction
export const update = async (id, transactionData) => {
  return fetchAPI(`/transaction/${id}`, {
    method: "PUT",
    body: JSON.stringify(transactionData),
  });
};

// Delete a transaction
export const remove = async (id) => {
  return fetchAPI(`/transaction/${id}`, {
    method: "DELETE",
  });
};

const transactionsAPI = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default transactionsAPI;