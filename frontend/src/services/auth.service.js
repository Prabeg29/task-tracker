import axiosInstance from "./axios.service";

export default {
  register: (payload) => axiosInstance.post("/auth/register", payload),
  login: (payload) => axiosInstance.post("/auth/login", payload),
  initiateGoogleConsent: () => axiosInstance.post("/auth/google/consent"),
  googleLogin: (payload) => axiosInstance.post("/auth/google/callback", payload) 
};
