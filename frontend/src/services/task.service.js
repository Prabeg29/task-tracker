import axiosInstance from "./axios.service";

const fetchAllPaginated = async ({ search, status, currentPage, perPage, sortBy, sortOrder }) => axiosInstance.get(
  `/tasks?search=${search}&status=${status}&currentPage=${currentPage}&perPage=${perPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`
);

const create = async (payload) => axiosInstance.post("/tasks", payload);

const update = async (id, payload) => axiosInstance.put(`/tasks/${id}`, payload);

const destroy = async (id) => axiosInstance.delete(`/tasks/${id}`);

export { fetchAllPaginated, create, update, destroy };
