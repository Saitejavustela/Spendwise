import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Receipt, 
  FolderOpen, 
  Users, 
  Plane,
  X,
  User
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

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
  const user = useAuthStore((s) => s.user);

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

        {/* Footer with User Info */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          
          {/* Copyright */}
          <p className="text-xs text-gray-500 text-center">© 2024 SpendWise</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
