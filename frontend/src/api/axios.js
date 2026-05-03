import axios from "axios";

const API = axios.create({
  baseURL: "https://blog-platform-9xw9.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;