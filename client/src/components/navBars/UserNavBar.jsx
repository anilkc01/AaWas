import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { BadgeCheck, User, LogOut, Key, Edit } from "lucide-react";
import api from "../../api/axios";

export default function Navbar({ onLogout, view, setView }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [kycData, setKycData] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch KYC status and data
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const response = await api.get("/api/kyc/status");
        if (response.data.status === "verified" && response.data.kyc) {
          setKycData(response.data.kyc);
        }
      } catch (err) {
        console.error("Failed to fetch KYC status:", err);
      }
    };

    fetchKycStatus();
  }, []);

  const handleToggleClick = () => {
    setView(view === "my" ? "browse" : "my");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    if (typeof onLogout === "function") {
      onLogout();
    }
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get image URL
  const getImageUrl = () => {
    if (kycData?.image) {
      // If your backend serves static files from /uploads
      return `${api.defaults.baseURL}/${kycData.image}`;
    }
    return null;
  };

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-12 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center select-none">
          <img src="/logo.png" alt="AaWAS Logo" className="h-10 w-auto" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4 text-gray-700 text-sm">
          <Link
            to="/about-us"
            className="text-[#B59353] hover:text-black px-2 py-1"
          >
            About Us
          </Link>

          <button
            onClick={handleToggleClick}
            className="px-3 py-1 rounded-md bg-[#B59353] text-white text-xs"
          >
            {view === "my" ? "Browse Properties" : "Your Property"}
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="relative w-8 h-8">
              {/* PROFILE BUTTON */}
              <button
                onClick={() => setOpen(!open)}
                className="w-8 h-8 rounded-full bg-[#B59353] flex items-center justify-center text-white hover:opacity-90"
              >
                {getImageUrl() ? (
                  <img
                    src={getImageUrl()}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </button>

              {/* FLOATING VERIFIED BADGE */}
              {kycData && (
                <span
                  className="absolute -bottom-0.5 -right-0.5
        text-green-500 bg-white rounded-full shadow"
                >
                  <BadgeCheck size={12} />
                </span>
              )}
            </div>

            {open && (
              <div
                className="absolute right-0 mt-2 w-44 bg-white rounded-md
                  shadow-lg border text-sm overflow-hidden"
              >
                <Link
                  to="/edit-profile"
                  className="flex items-center gap-2 px-4 py-2
                    hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <Edit size={14} />
                  Edit Profile
                </Link>

                <Link
                  to="/change-password"
                  className="flex items-center gap-2 px-4 py-2
                    hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <Key size={14} />
                  Change Password
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2
                    px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
