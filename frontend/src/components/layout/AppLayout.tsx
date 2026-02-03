import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import FloatingAddButton from "../common/FloatingAddButton";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - fixed on left */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar - fixed at top */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Scrollable main content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Floating Action Button */}
      <FloatingAddButton />
    </div>
  );
};

export default AppLayout;
