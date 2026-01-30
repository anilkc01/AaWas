import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api/axios";

import GuestPage from "./layouts/guestWelcome";
import UserDashboard from "./layouts/UserDashboard";
import AdminDashboard from "./layouts/AdminDashboard";

import BrowseProperties from "./pages/user/browseProperties";
import MyProperties from "./pages/user/myProperties";
import KycForm from "./pages/user/kyc";
import UsersPage from "./pages/admin/usersPage";
import PropertiesPage from "./pages/admin/propertiesPage";
import ReportsPage from "./pages/admin/reportsPage";
import KycPage from "./pages/admin/kycPage";
import toast from "react-hot-toast";

export default function AppContent() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState(null);

  const checkAuth = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setAuthorized(false);
      setRole(null);
      setAuthChecked(true);
      return;
    }

    try {
      const res = await api.get("/api/auth/verify");
      setAuthorized(true);
      setRole(res.data.user.role);
    } catch {
      toast.error("Session expired. Please log in again.", { id: "authError" });
      setAuthorized(false);
      setRole(null);
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (!authChecked) return null;

  return (
    <Routes>
      {/* GUEST */}
      {!authorized && (
        <Route path="*" element={<GuestPage onLoginSuccess={checkAuth} />} />
      )}

      {/* ADMIN */}
      {authorized && role === "admin" && (
        <Route path="/" element={<AdminDashboard onLogout={checkAuth} />}>
          {/* Default admin page */}
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="kyc" element={<KycPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      )}

      {/* USER */}
      {authorized && role === "user" && (
        <Route path="/" element={<UserDashboard onLogout={checkAuth} />}>
          <Route index element={<BrowseProperties />} />
          <Route path="my" element={<MyProperties />} />
          <Route path="kyc" element={<KycForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
}
