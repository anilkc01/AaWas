import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, Building2, FileCheck, FlagIcon, Menu, X, LogOut } from "lucide-react";
import AdminNavbar from "../components/navBars/AdminNavBar";

export default function AdminDashboard({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, { id: "admin-login" });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogoutAction = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsSidebarOpen(false); // Close sidebar
    onLogout();              // Notify parent state
    navigate("/");           // Redirect to home/login
  };

  const menuItems = [
    { path: "/users", label: "Users", icon: Users },
    { path: "/properties", label: "Properties", icon: Building2 },
    { path: "/kyc", label: "KYC", icon: FileCheck },
    { path: "/reports", label: "Reports", icon: FlagIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Navbar - Fixed at top */}
      <AdminNavbar onLogout={onLogout} />

      {/* Main Container */}
      <div className="flex flex-1 pt-16 md:pt-20 h-screen overflow-hidden">
        
        {/* --- SIDEBAR --- */}
        <aside className={`
          fixed inset-y-0 left-0 z-[100] w-72 bg-white border-r pt-20 flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0 lg:h-full
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <nav className="flex-1 p-5 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all
                  ${isActive 
                    ? "bg-[#B59353] text-white shadow-lg shadow-[#B59353]/30 scale-[1.02]" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-[#B59353]"}
                `}
              >
                <item.icon size={20} strokeWidth={2.5} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout Mobile Only */}
          <div className="p-5 lg:hidden border-t">
            <button onClick={handleLogoutAction} className="flex items-center gap-4 w-full px-5 py-4 text-red-600 font-black text-[11px] uppercase rounded-2xl hover:bg-red-50 transition-colors">
              <LogOut size={20} strokeWidth={2.5} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-24 lg:pb-0">
            <Outlet />
          </div>
        </main>
      </div>

      {/* --- MOBILE TOGGLE BUTTON --- */}
      {/* Higher Z-Index to stay above everything */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-[110] bg-[#B59353] text-white p-5 rounded-full shadow-2xl active:scale-90 transition-transform"
      >
        {isSidebarOpen ? <X size={28} strokeWidth={3} /> : <Menu size={28} strokeWidth={3} />}
      </button>

      {/* Dark Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}