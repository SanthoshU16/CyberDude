import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const checkEmail = async (email) => {
  const { data } = await api.post("/api/v1/email/check", { email });
  return data;
};

export const checkDomain = async (website) => {
  const { data } = await api.post("/api/v1/domain/check", { website });
  return data;
};

export const checkHeaders = async (headers) => {
  const { data } = await api.post("/api/v1/headers/check", { headers });
  return data;
};

export const checkBreach = async (email) => {
  const { data } = await api.post("/api/v1/breach/check", { email });
  return data;
};

export const analyzeFile = async (filename) => {
  const { data } = await api.post("/api/v1/file/analyze", { filename });
  return data;
};

export const reportThreat = async (threat_type, indicator) => {
  const { data } = await api.post("/api/v1/report/", { threat_type, indicator });
  return data;
};

export default api;
