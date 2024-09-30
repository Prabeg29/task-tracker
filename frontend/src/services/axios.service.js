import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8848/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.post("auth/generate-access-token", { }, { withCredentials: true });

        console.log(response)

        return axiosInstance(originalRequest); 
      } catch (error) {
        localStorage.setItem("user", null);
        window.location.href = "/auth/login"
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
