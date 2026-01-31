import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

const FloatingAddButton = () => {
  const location = useLocation();
  
  // Don't show on add expense page
  if (location.pathname === "/expenses/add") return null;

  return (
    <Link
      to="/expenses/add"
      className="fixed right-4 bottom-4 z-40 lg:hidden w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-600/30 flex items-center justify-center transition-all active:scale-95"
    >
      <Plus className="w-6 h-6" />
    </Link>
  );
};

export default FloatingAddButton;
