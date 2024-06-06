import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8848/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.request.use(
  function (config) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    return config;
  },
  function (error) {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const user = JSON.parse(localStorage.getItem("user"))
      const refreshToken = user.refreshToken;

      try {
        const response = await axios.post("http://localhost:8848/api/auth/generate-access-token", { refreshToken });

        const accessToken = response.data.accessToken;
        localStorage.setItem("user", JSON.stringify({ ...user, accessToken: accessToken}));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axios(originalRequest); 
      } catch (error) {
        localStorage.setItem("user", null);
        window.location.href = "/auth/login"
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
