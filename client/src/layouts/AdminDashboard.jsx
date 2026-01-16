import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, Building2, FileCheck, BarChart3, Menu, X, LogOut } from "lucide-react";
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

  const menuItems = [
    { path: "/users", label: "Users", icon: Users },
    { path: "/properties", label: "Properties", icon: Building2 },
    { path: "/kyc", label: "KYC", icon: FileCheck },
    { path: "/reports", label: "Reports", icon: BarChart3 },
  ];

  const handleLogoutAction = () => {
    setIsSidebarOpen(false);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar onLogout={onLogout} />

      {/* Mobile Sidebar Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[70] bg-[#B59353] text-white p-4 rounded-full shadow-2xl active:scale-90 transition-transform"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-1 pt-16 md:pt-20">
        {/* --- SIDEBAR --- */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r pt-20 flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-[calc(100vh-80px)]
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          {/* Navigation Links */}
          <nav className="flex-1 p-6 space-y-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all
                  ${isActive 
                    ? "bg-[#B59353] text-white shadow-lg shadow-[#B59353]/20 scale-[1.02]" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#B59353]"}
                `}
              >
                <item.icon size={22} />
                <span className="text-lg">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile-Only Logout Section at the bottom of the drawer */}
          <div className="p-6 lg:hidden border-t border-gray-100">
            <button
              onClick={handleLogoutAction}
              className="flex items-center gap-4 w-full px-5 py-4 text-red-600 font-black rounded-2xl hover:bg-red-50 transition-colors"
            >
              <LogOut size={22} />
              <span className="text-lg">Logout</span>
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Dark Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}