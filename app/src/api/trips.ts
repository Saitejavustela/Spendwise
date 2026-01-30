import { api } from "./axiosClient";

// Get all trips
export const getTripsAPI = async () => {
  const { data } = await api.get("/trips");
  return data;
};

// Create trip
export const createTripAPI = async (payload: any) => {
  const { data } = await api.post("/trips", payload);
  return data;
};

// Add budget category to trip
export const addTripBudgetAPI = async (payload: any) => {
  const { data } = await api.post("/trips/budget", payload);
  return data;
};

// Update (expand) budget
export const updateBudgetAPI = async (budgetId: string, additionalAmount: number) => {
  const { data } = await api.patch(`/trips/budget/${budgetId}`, { additionalAmount });
  return data;
};

// Add expense to trip
export const addTripExpenseAPI = async (payload: any) => {
  const { data } = await api.post("/trips/expense", payload);
  return data;
};

// Get category expenses with pagination
export const getCategoryExpensesAPI = async (
  tripId: string,
  category: string,
  page: number = 1,
  limit: number = 10
) => {
  const { data } = await api.get(`/trips/${tripId}/category/${encodeURIComponent(category)}/expenses`, {
    params: { page, limit },
  });
  return data;
};

// Trip summary with budget usage
export const getTripSummaryAPI = async (tripId: string) => {
  const { data } = await api.get(`/trips/${tripId}/summary`);
  return data;
};
