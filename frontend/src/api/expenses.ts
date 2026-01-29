import { api } from "./axiosClient";

// Fetch all expenses (with pagination)
export const getExpensesAPI = async () => {
  const { data } = await api.get("/expenses");
  return data;
};

// Create new expense
export const createExpenseAPI = async (payload: any) => {
  const { data } = await api.post("/expenses", payload);
  return data;
};

// Get expense by id
export const getExpenseAPI = async (id: string) => {
  const { data } = await api.get(`/expenses/${id}`);
  return data;
};

// Delete expense
export const deleteExpenseAPI = async (id: string) => {
  const { data } = await api.delete(`/expenses/${id}`);
  return data;
};
