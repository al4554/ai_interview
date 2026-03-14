import apiClient from "../utils/apiClient";

export const getReportApi = async (id) => {
  const { data } = await apiClient.get(`/reports/${id}`);
  return data.data;
};

export const downloadReportApi = async (id) => {
  const response = await apiClient.get(`/reports/${id}/pdf`, {
    responseType: "blob"
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `mock-interview-report-${id}.pdf`;
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};
