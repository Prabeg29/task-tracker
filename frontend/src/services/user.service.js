import axios from "axios";

let token;
let user = window.localStorage.getItem("user");

if (user && user !== "null") {
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

const fetchAll = async () => axiosInstance.get("/users");

export { fetchAll };
