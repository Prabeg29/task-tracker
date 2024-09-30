import axiosInstance from "./axios.service";

export default {
  initiateGoogleConsent: () => axiosInstance.post("/auth/google/consent"),
  googleLogin: (payload) => axiosInstance.post("/auth/google/callback", payload) 
};
