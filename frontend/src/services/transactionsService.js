// frontend/src/services/transactionsAPI.js

import api from "./api";

// Get all transactions (optionally with filters)
export const getAll = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  return api.get(`/transactions${queryString}`);
};

// Get a transaction by ID
export const getById = async (id) => {
  return api.get(`/transactions/${id}`);
};

// Create a new transaction
export const create = async (transactionData) => {
  return api.post("/transactions", {
    method: "POST",
    body: JSON.stringify(transactionData),
  });
};

// Update a transaction
export const update = async (id, transactionData) => {
  return api.put(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(transactionData),
  });
};

// Delete a transaction
export const remove = async (id) => {
  return api.delete(`/transactions/${id}`);
};

const transactionsAPI = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default transactionsAPI;