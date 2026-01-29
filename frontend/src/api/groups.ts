import { api } from "./axiosClient";

// Get all groups for user
export const getGroupsAPI = async () => {
  const { data } = await api.get("/groups");
  return data;
};

// Create new group
export const createGroupAPI = async (payload: any) => {
  const { data } = await api.post("/groups", payload);
  return data;
};

// Add new member to group
export const addGroupMemberAPI = async (payload: any) => {
  const { data } = await api.post("/groups/member", payload);
  return data;
};

// Delete a member from group
export const deleteGroupMemberAPI = async (memberId: string) => {
  const { data } = await api.delete(`/groups/member/${memberId}`);
  return data;
};

// Add an expense to a group
export const addGroupExpenseAPI = async (payload: any) => {
  const { data } = await api.post("/groups/expense", payload);
  return data;
};

// Add a settlement (user paying another user)
export const addSettlementAPI = async (payload: any) => {
  const { data } = await api.post("/groups/settlement", payload);
  return data;
};

// Group summary (balances)
export const getGroupSummaryAPI = async (groupId: string) => {
  const { data } = await api.get(`/groups/${groupId}/summary`);
  return data;
};

// Get category-specific summary
export const getGroupCategorySummaryAPI = async (groupId: string, category: string) => {
  const { data } = await api.get(`/groups/${groupId}/category/${encodeURIComponent(category)}`);
  return data;
};
