import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Expenses", to: "/expenses" },
  { label: "Categories", to: "/categories" },
  { label: "Groups", to: "/groups" },
  { label: "Trips", to: "/trips" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-5">Expense Tracker</h1>

      <nav className="flex flex-col space-y-3">
        {menu.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`p-2 rounded hover:bg-gray-700 ${
              location.pathname.startsWith(item.to) ? "bg-gray-700" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
