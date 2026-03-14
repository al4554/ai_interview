import apiClient from "../utils/apiClient";

export const signupApi = async (payload) => {
  const { data } = await apiClient.post("/auth/signup", payload);
  return data.data;
};

export const loginApi = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data.data;
};

export const getMeApi = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data.data;
};
