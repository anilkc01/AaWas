import { useEffect, useState } from "react";
import api from "./api/axios";
import UserDashboard from "./layouts/UserDashboard";
import AdminDashboard from "./layouts/AdminDashboard";
import GuestPage from "./layouts/guestWelcome";

export default function AppContent() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState(null);

  const checkAuth = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setAuthorized(false);
      setRole(null);
      setAuthChecked(true);
      return;
    }

    try {
      const res = await api.get("/api/auth/verify");

      setAuthorized(true);
      setRole(res.data.user.role); // 🔐 FROM BACKEND
    } catch {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
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

  if (!authorized) {
    return <GuestPage onLoginSuccess={checkAuth} />;
  }


  if (role === "admin") {
    return <AdminDashboard onLogout={checkAuth} />;
  }

  return <UserDashboard onLogout={checkAuth} />;
}
