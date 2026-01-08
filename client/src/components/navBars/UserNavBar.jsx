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
      return `${api.defaults.baseURL}/${kycData.image}`;
    } else {
      console.log("no kyc image");
    }
    return null;
  };

  return (
    
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="w-full mx-auto flex justify-between items-center h-16 px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center select-none">
          <img src="/logo.png" alt="AaWAS Logo" className="h-14 w-auto" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6 text-gray-700 text-base">
          <Link
            to="/about-us"
            className="text-[#B59353] hover:text-black px-3 py-1.5"
          >
            About Us
          </Link>

          <button
            onClick={handleToggleClick}
            className="px-4 py-2 rounded-md bg-[#B59353] text-white text-sm"
          >
            {view === "my" ? "Browse Properties" : "Your Property"}
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="relative w-11 h-11">
              {/* PROFILE BUTTON */}
              <button
                onClick={() => setOpen(!open)}
                className="w-11 h-11 rounded-full bg-[#B59353] flex items-center justify-center text-white hover:opacity-90"
              >
                {getImageUrl() ? (
                  <img
                    src={getImageUrl()}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={22} />
                )}
              </button>

              {/* FLOATING VERIFIED BADGE */}
              {kycData && (
                <span
                  className="absolute -bottom-0.5 -right-0.5
        text-green-500 bg-white rounded-full shadow"
                >
                  <BadgeCheck size={16} />
                </span>
              )}
            </div>

            {open && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-md
                  shadow-lg border text-base overflow-hidden"
              >
                <Link
                  to="/edit-profile"
                  className="flex items-center gap-3 px-5 py-3
                    hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <Edit size={18} />
                  Edit Profile
                </Link>

                <Link
                  to="/change-password"
                  className="flex items-center gap-3 px-5 py-3
                    hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <Key size={18} />
                  Change Password
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3
                    px-5 py-3 text-red-600 hover:bg-red-50"
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
  );
}