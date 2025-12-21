import { useEffect, useState } from "react";
import api from "./api/axios";
import DashboardPage from "./layouts/UserDashboard";
import GuestPage from "./layouts/guestWelcome";



export default function AppContent() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const checkAuth = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setAuthorized(false);
      setAuthChecked(true);
      return;
    }

    try {
      await api.get("/api/auth/verify");
      setAuthorized(true);
    } catch {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      setAuthorized(false);
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (!authChecked) return null;

  return authorized
    ? <DashboardPage  onLogout={() => setAuthorized(false)} />
    : <GuestPage onLoginSuccess={checkAuth} />;
}
