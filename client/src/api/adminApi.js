import apiClient from "../utils/apiClient";

export const getAdminUsersApi = async () => {
  const { data } = await apiClient.get("/admin/users");
  return data.data;
};

export const getAdminAnalyticsApi = async () => {
  const { data } = await apiClient.get("/admin/analytics");
  return data.data;
};
