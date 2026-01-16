import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/navBars/UserNavBar.jsx";

export default function UserDashboard({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, { id: "login" });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      <Navbar onLogout={onLogout} />

      <div className="pt-14 px-6">
        <Outlet />
      </div>
    </>
  );
}
