import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { BadgeCheck, User, LogOut, Settings } from "lucide-react";
import api from "../../api/axios";
import SettingsModal from "../cards/settingModal";


export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // State for Modal
  const [kycData, setKycData] = useState(null);
  
  // You might want to store basic user info (email/id) in state or context
  // Assuming basic user info is in localStorage or you can fetch it similarly
  const user = JSON.parse(localStorage.getItem("user") || "{}"); 

  const dropdownRef = useRef(null);
  const isMyProperties = location.pathname === "/my";

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const res = await api.get("/api/kyc/status");
        if (res.data.status === "verified") {
          setKycData(res.data.kyc);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchKycStatus();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    onLogout?.();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getImageUrl = () =>
    kycData?.image ? `${api.defaults.baseURL}/${kycData.image}` : null;

  return (
    <>
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="flex justify-between items-center h-16 md:h-20 px-4 md:px-10">

          {/* Logo */}
          <Link to="/" className="flex items-center transition-transform hover:scale-105 shrink-0">
            <img src="/logo.png" alt="AaWAS Logo" className="h-10 md:h-16 w-auto" />
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-3 md:gap-8">
            <Link
              to="/about-us"
              className="hidden sm:block text-base md:text-lg font-bold text-[#B59353] hover:text-black transition-colors"
            >
              About Us
            </Link>

            <button
              onClick={() => navigate(isMyProperties ? "/" : "/my")}
              className="px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-[#B59353] text-white font-bold text-xs md:text-base shadow-sm hover:bg-[#a68546] transition-all active:scale-95"
            >
              {isMyProperties ? "Browse" : "My Properties"}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#B59353] border-2 border-white shadow-md flex items-center justify-center text-white transition-transform hover:scale-105"
              >
                {getImageUrl() ? (
                  <img
                    src={getImageUrl()}
                    alt="profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={20} className="md:w-7 md:h-7" />
                )}
              </button>

              {kycData && (
                <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                  <BadgeCheck className="w-4 h-4 md:w-5 md:h-5 text-green-500 fill-white" />
                </span>
              )}

              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2 z-[60]">
                  
                  {/* Settings Item */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowSettings(true);
                    }}
                    className="w-full flex gap-3 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors items-center"
                  >
                    <Settings size={18} className="text-[#B59353]" /> 
                    Setting
                  </button>

                  <div className="h-px bg-gray-100 my-1 mx-4" />

                  {/* Logout Item */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex gap-3 px-6 py-3 text-base font-bold text-red-600 hover:bg-red-50 transition-colors items-center"
                  >
                    <LogOut size={18} /> 
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Modal Component */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        user={user}
        kycData={kycData}
      />
    </>
  );
}