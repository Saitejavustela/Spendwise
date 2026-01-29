import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

import Login from "../pages/auth/Login";
import AuthCallback from "../pages/auth/AuthCallback";

import Dashboard from "../pages/dashboard/Dashboard";
import ExpenseList from "../pages/expenses/ExpenseList";
import AddExpense from "../pages/expenses/AddExpense";
import Categories from "../pages/categories/Categories";
import CategoryDetail from "../pages/categories/CategoryDetail";
import Groups from "../pages/groups/Groups";
import GroupDetail from "../pages/groups/GroupDetail";
import Trips from "../pages/trips/Trips";
import TripDetail from "../pages/trips/TripDetail";

import { useAuthStore } from "../store/authStore";

// Protect routes using Zustand auth store
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = localStorage.getItem("accessToken");

  return isLoggedIn || token ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Private Dashboard Layout */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/expenses/add" element={<AddExpense />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />

          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />

          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDetail />} />
        </Route>

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
