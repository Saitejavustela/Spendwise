import { api } from "./axiosClient";

export const loginAPI = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const registerAPI = async (name: string, email: string, password: string) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};
