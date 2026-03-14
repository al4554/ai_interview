import apiClient from "../utils/apiClient";

export const startInterviewApi = async (payload) => {
  const { data } = await apiClient.post("/interviews/start", payload);
  return data.data;
};

export const answerInterviewApi = async (interviewId, payload) => {
  const { data } = await apiClient.post(`/interviews/${interviewId}/answer`, payload);
  return data.data;
};

export const completeInterviewApi = async (interviewId) => {
  const { data } = await apiClient.post(`/interviews/${interviewId}/complete`);
  return data.data;
};

export const getInterviewApi = async (interviewId) => {
  const { data } = await apiClient.get(`/interviews/${interviewId}`);
  return data.data;
};

export const getInterviewHistoryApi = async () => {
  const { data } = await apiClient.get("/interviews/history");
  return data.data;
};

export const uploadResumeApi = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await apiClient.post("/interviews/upload-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data.data;
};
