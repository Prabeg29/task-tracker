import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8848/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  initiateGoogleConsent: () => axiosInstance.post("/auth/google/consent"),
  googleLogin: (payload) => axiosInstance.post("/auth/google/callback", payload) 
};
