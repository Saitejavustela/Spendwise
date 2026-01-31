import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Receipt, 
  FolderOpen, 
  Users, 
  Plane,
  X 
} from "lucide-react";

const menu = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Expenses", to: "/expenses", icon: Receipt },
  { label: "Categories", to: "/categories", icon: FolderOpen },
  { label: "Groups", to: "/groups", icon: Users },
  { label: "Trips", to: "/trips", icon: Plane },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gray-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-emerald-400">SpendWise</h1>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.to);
            
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">© 2024 SpendWise</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
