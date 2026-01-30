import { useAuthStore } from "../../store/authStore";
import { useCalculatorStore } from "../../store/calculatorStore";
import { Calculator } from "lucide-react";

const Navbar = () => {
  const logout = useAuthStore((s) => s.logout);
  const { open: openCalculator } = useCalculatorStore();

  return (
    <header className="w-full flex justify-end items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 shadow">
      <button
        onClick={openCalculator}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
        title="Calculator"
      >
        <Calculator className="w-5 h-5" />
      </button>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;

