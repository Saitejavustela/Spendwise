import { api } from "./axiosClient";

// Get all categories with subcategories
export const getCategoriesAPI = async () => {
  const { data } = await api.get("/categories");
  return data;
};

// Create category
export const createCategoryAPI = async (payload: any) => {
  const { data } = await api.post("/categories", payload);
  return data;
};

// Delete category
export const deleteCategoryAPI = async (id: string) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};

// Create subcategory
export const createSubCategoryAPI = async (payload: any) => {
  const { data } = await api.post("/categories/sub", payload);
  return data;
};

// Delete subcategory
export const deleteSubCategoryAPI = async (id: string) => {
  const { data } = await api.delete(`/categories/sub/${id}`);
  return data;
};

// Category detail (breakdown + expenses)
export const getCategoryDetailAPI = async (id: string) => {
  const { data } = await api.get(`/categories/${id}/detail`);
  return data;
};

