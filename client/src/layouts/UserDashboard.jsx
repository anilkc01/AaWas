import { useEffect, useState } from "react";
import Navbar from "../components/navBars/UserNavBar.jsx";
import BrowseProperties from "../pages/browseProperties.jsx";
import MyProperties from "../pages/myProperties.jsx";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function DashboardPage({ onLogout }) {
  const [view, setView] = useState("browse"); // "browse" | "my"
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    
    if (location.state?.message) {
      toast.success(location.state.message, {id:"loggedd in"});
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      <Navbar
        onLogout={onLogout}
        view={view}
        setView={setView}
      />

      <div className="pt-14 px-6">
        {view === "my" ? <MyProperties /> : <BrowseProperties />}
      </div>
    </>
  );
}
