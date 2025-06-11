import api from "./api";

const categoriesService = {
  getAll: () => api.get("/api/categories"),
  create: (data) => api.post("/api/categories", data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

export default categoriesService;