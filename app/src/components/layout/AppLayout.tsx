import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
