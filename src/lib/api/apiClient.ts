import axios, { AxiosInstance, AxiosError } from "axios";
import Cookies from "js-cookie";

// admin-backend default (see /admin-backend/src/index.ts -> PORT 3002, routes under /api/*)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("adminToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
