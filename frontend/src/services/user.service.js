import axiosInstance from "./axios.service";

const fetchAll = async () => axiosInstance.get("/users");

export { fetchAll };
