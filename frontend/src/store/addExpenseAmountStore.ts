import { create } from "zustand";

interface AddAmountState {
  setAmount: ((value: number) => void) | null;
  registerAmountSetter: (fn: (value: number) => void) => void;
}

export const useAddExpenseAmount = create<AddAmountState>((set) => ({
  setAmount: null,
  registerAmountSetter: (fn) => set({ setAmount: fn }),
}));
