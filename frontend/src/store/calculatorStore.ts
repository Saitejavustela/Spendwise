import { create } from "zustand";

interface CalculatorState {
  isOpen: boolean;
  expression: string;
  result: number | null;

  open: () => void;
  close: () => void;

  setExpression: (e: string) => void;
  setResult: (r: number | null) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  isOpen: false,
  expression: "",
  result: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, expression: "", result: null }),

  setExpression: (e) => set({ expression: e }),
  setResult: (r) => set({ result: r }),
}));
