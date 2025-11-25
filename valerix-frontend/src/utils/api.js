import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// Load token BEFORE creating axios instance
const initialToken = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    Authorization: initialToken ? `Bearer ${initialToken}` : "",
  },
});

// Interceptor for dynamic token changes
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
