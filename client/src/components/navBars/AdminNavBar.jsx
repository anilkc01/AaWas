import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function AdminNavbar({ onLogout }) {
  return (
    <nav className="w-full bg-white shadow-sm border-b fixed top-0 left-0 z-[60]">
      <div className="w-full mx-auto flex justify-between items-center h-16 md:h-20 px-4 md:px-10">
        
        {/* Logo */}
        <Link to="/" className="flex items-center select-none transition-transform hover:scale-105 shrink-0">
          <img src="/logo.png" alt="AaWAS Logo" className="h-10 md:h-16 w-auto" />
        </Link>

        {/* Right side Actions */}
        <div className="flex items-center gap-4 text-gray-800">
          <span className="text-xs md:text-sm font-bold text-gray-400 tracking-widest uppercase bg-gray-50 px-3 py-1 rounded-full">
            Admin Panel
          </span>

          {/* Logout: Hidden on mobile, visible on Desktop (lg) */}
          <button
            onClick={onLogout}
            className="hidden lg:flex items-center gap-2 bg-red-50 text-red-600 font-bold
              px-6 py-2.5 rounded-xl text-base hover:bg-red-600 hover:text-white 
              transition-all active:scale-95 whitespace-nowrap"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}