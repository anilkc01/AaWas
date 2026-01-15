import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";



export default function AdminDashboard({ onLogout }) {
 const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    
    if (location.state?.message) {
      toast.success(location.state.message, {id:"loggedd in"});
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="flex h-screen">
    
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
          {/* Admin dashboard content goes here */}
        </main>
  
    </div>
  );
}
