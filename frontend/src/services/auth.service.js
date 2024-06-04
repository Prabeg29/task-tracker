import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8848/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});

const register = async (payload) => axiosInstance.post("/auth/register", payload);

const login = async (payload) => axiosInstance.post("/auth/login", payload);

export { login, register };
