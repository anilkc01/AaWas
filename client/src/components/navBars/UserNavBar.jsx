import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { BadgeCheck, User, LogOut, Key, Edit } from "lucide-react";
import api from "../../api/axios";

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [kycData, setKycData] = useState(null);
  const dropdownRef = useRef(null);

  const isMyProperties = location.pathname === "/my";

  /* Fetch KYC */
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

  /* Logout */
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    onLogout?.();
    navigate("/");
  };

  /* Close dropdown */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getImageUrl = () =>
    kycData?.image ? `${api.defaults.baseURL}/${kycData.image}` : null;

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center h-16 px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="AaWAS Logo" className="h-14" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">

          <Link
            to="/about-us"
            className="text-[#B59353] hover:text-black"
          >
            About Us
          </Link>

          {/* Toggle button */}
          <button
            onClick={() => navigate(isMyProperties ? "/" : "/my")}
            className="px-4 py-2 rounded-md bg-[#B59353] text-white text-sm"
          >
            {isMyProperties ? "Browse Properties" : "Your Properties"}
          </button>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="w-11 h-11 rounded-full bg-[#B59353] flex items-center justify-center text-white"
            >
              {getImageUrl() ? (
                <img
                  src={getImageUrl()}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={22} />
              )}
            </button>

            {kycData && (
              <span className="absolute -bottom-1 -right-1 bg-white rounded-full">
                <BadgeCheck size={16} className="text-green-500" />
              </span>
            )}

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow border">
                <Link
                  to="/edit-profile"
                  onClick={() => setOpen(false)}
                  className="flex gap-3 px-5 py-3 hover:bg-gray-100"
                >
                  <Edit size={18} /> Edit Profile
                </Link>

                <Link
                  to="/change-password"
                  onClick={() => setOpen(false)}
                  className="flex gap-3 px-5 py-3 hover:bg-gray-100"
                >
                  <Key size={18} /> Change Password
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex gap-3 px-5 py-3 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
