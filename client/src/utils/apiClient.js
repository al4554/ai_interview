import axios from "axios";
import { authStorage } from "./storage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

apiClient.interceptors.request.use((config) => {
  const auth = authStorage.get();

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

export default apiClient;
