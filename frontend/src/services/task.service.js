import axios from "axios";

let token;
let user = window.localStorage.getItem("user");

if (user) {
  user = JSON.parse(user);
  token = `${user.type} ${user.accessToken}`
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8848/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": token
  }
});

const fetchAllPaginated = async ({ search, status, currentPage, perPage, sortBy, sortOrder }) => axiosInstance.get(
  `/tasks?search=${search}&status=${status}&currentPage=${currentPage}&perPage=${perPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`
);

const create = async (payload) => axiosInstance.post("/tasks", payload);

const update = async (id, payload) => axiosInstance.put(`/tasks/${id}`, payload);

export { fetchAllPaginated, create, update };
