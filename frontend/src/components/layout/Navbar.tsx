import { useAuthStore } from "../../store/authStore";
import { useCalculatorStore } from "../../store/calculatorStore";
import { Calculator, Menu, LogOut } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const { open: openCalculator } = useCalculatorStore();

  return (
    <header className="sticky top-0 z-30 w-full flex justify-between items-center gap-3 px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 shadow">
      {/* Left side - Mobile menu button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
          title="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Mobile logo */}
        <span className="lg:hidden font-bold text-emerald-600 dark:text-emerald-400">
          SpendWise
        </span>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User avatar/name - hidden on very small screens */}
        {user?.name && (
          <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
            Hi, {user.name.split(' ')[0]}
          </span>
        )}
        
        <button
          onClick={openCalculator}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
          title="Calculator"
        >
          <Calculator className="w-5 h-5" />
        </button>
        
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
