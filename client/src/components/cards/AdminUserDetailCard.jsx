import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Star,
  BadgeCheck,
  User as UserIcon,
  X,
  ShieldAlert,
  ShieldCheck,
  Flag,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const API_BASE = process.env.REACT_APP_API_BASE;

export const AdminUserDetailCard = ({ userId, onClose, onUpdate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // New states for Report handling
  const [activeTab, setActiveTab] = useState("reviews"); // "reviews" or "reports"
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  // Fetch report list when switching to reports tab
  useEffect(() => {
    if (activeTab === "reports" && userId) {
      fetchReports();
    }
  }, [activeTab, userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/profile/${userId}`);
      setData(res.data);
    } catch (err) {
      toast.error("User profile unavailable");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await api.get(`/api/admin/reports/${userId}`);
      setReports(res.data);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoadingReports(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/api/admin/user-status/${userId}`, {
        status: newStatus,
      });
      toast.success(
        `User ${newStatus === "active" ? "activated" : "suspended"}`,
      );
      fetchProfile();
      onUpdate?.();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100] flex items-center justify-center">
        <div className="bg-white p-10 rounded-[2rem] font-black animate-pulse text-[#B59353]">
          ANALYZING USER...
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
      <div className="bg-[#D1D5DB] rounded-[3rem] w-full max-w-md max-h-[95vh] overflow-y-auto shadow-2xl relative p-6 custom-scrollbar border-4 border-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-gray-700 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          {/* Avatar & Verification */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-black bg-white shadow-xl">
              {data.kyc?.image ? (
                <img
                  src={`${API_BASE}/${data.kyc.image}`}
                  className="w-full h-full object-cover"
                  alt="user"
                />
              ) : (
                <UserIcon size={112} className="text-gray-200" />
              )}
            </div>
            {data.kyc?.verificationStatus === "verified" && (
              <span className="absolute -bottom-0 -right-0 bg-white rounded-full p-0.5 shadow">
                <BadgeCheck className="w-6 h-6 text-green-500 fill-white" />
              </span>
            )}
          </div>

          {/* User Status Badge */}
          <div
            className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${data.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            Account {data.status}
          </div>

          {/* Identity Info */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight leading-none">
              {data.fullName}
            </h2>

            {/* Rating Stars Beneath Name */}
            <div className="flex justify-center gap-0.5 pt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s <= Math.round(data.rating || 0) ? "#FFD700" : "none"}
                  color={
                    s <= Math.round(data.rating || 0) ? "#FFD700" : "#9CA3AF"
                  }
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-1 text-sm font-bold text-gray-800 pt-3">
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-gray-600" /> {data.phone}
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-gray-600" /> {data.email}
              </span>
              <span className="flex items-center gap-2 text-center px-4">
                <MapPin size={14} className="text-red-600 shrink-0" />
                <span className="italic">
                  {data.kyc?.address || "No Address Provided"}
                </span>
              </span>
            </div>
          </div>

          {/* Admin Control Center */}
          <div className="w-full bg-white rounded-[2rem] p-4 flex flex-col gap-2 shadow-inner">
            <p className="text-[9px] font-black uppercase text-gray-400 mb-1">
              Administrative Actions
            </p>
            <div className="flex gap-2">
              {data.status === "active" ? (
                <button
                  onClick={() => handleStatusChange("suspended")}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-2xl font-black text-[11px] uppercase hover:bg-red-100 transition-all active:scale-95"
                >
                  <ShieldAlert size={16} /> Suspend User
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange("active")}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 py-3 rounded-2xl font-black text-[11px] uppercase hover:bg-green-100 transition-all active:scale-95"
                >
                  <ShieldCheck size={16} /> Activate User
                </button>
              )}
            </div>
          </div>

          {/* Expanded 3-Column Stats */}
          <div className="grid grid-cols-3 gap-0 w-full py-4 border-y border-gray-400/30">
            <div className="border-r border-gray-400/30">
              <div className="text-xl font-black">
                {data.stats?.completedDeals || 0}
              </div>
              <div className="text-[9px] font-black uppercase text-gray-700">
                Deals
              </div>
            </div>
            <div className="border-r border-gray-400/30">
              <div className="text-xl font-black">
                {data.stats?.totalProperties || 0}
              </div>
              <div className="text-[9px] font-black uppercase text-gray-700">
                Property
              </div>
            </div>
            <button
              onClick={() =>
                setActiveTab(activeTab === "reports" ? "reviews" : "reports")
              }
              className={`hover:bg-gray-200/50 transition-colors rounded-xl ${activeTab === "reports" ? "bg-red-100" : ""}`}
            >
              <div
                className={`text-xl font-black ${data.stats?.reportCount > 0 ? "text-red-600" : "text-black"}`}
              >
                {data.stats?.reportCount || 0}
              </div>
              <div className="text-[9px] font-black uppercase text-gray-700 flex items-center justify-center ">
                 Reports
              </div>
            </button>
          </div>

          {/* Review/Report List Section */}
          <div className="w-full bg-white rounded-[2.5rem] p-6 min-h-[200px] shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-left px-2 flex justify-between">
              {activeTab === "reviews" ? "User Reviews" : "Flagged Reports"}
              <span className="text-black">
                {activeTab === "reviews" ? `★ ${data.rating || 0}` : ""}
              </span>
            </h3>

            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === "reviews" ? (
                // REVIEW TAB
                data.reviews.length === 0 ? (
                  <div className="text-xs text-gray-300 italic py-5">
                    No reviews on record
                  </div>
                ) : (
                  data.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="text-left border-b border-gray-100 pb-3 last:border-0"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-[11px] uppercase text-black">
                          {rev.reviewer?.fullName}
                        </span>
                        <span className="text-[10px] font-bold text-[#B59353]">
                          ★ {rev.rating}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600 font-medium leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                )
              ) : // REPORT TAB
              loadingReports ? (
                <div className="text-xs font-black animate-pulse text-red-500 py-10 uppercase tracking-widest">
                  Loading Reports...
                </div>
              ) : reports.length === 0 ? (
                <div className="text-xs text-gray-300 italic py-5">
                  No reports filed against this user
                </div>
              ) : (
                reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="text-left bg-red-50 p-4 rounded-2xl border border-red-100 mb-2"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-black text-[10px] uppercase text-red-600 tracking-tighter flex items-center gap-1">
                        <AlertCircle size={12} />
                       
                        {rep.reason
                          ? rep.reason.replace("_", " ")
                          : "GENERAL REPORT"}
                      </span>
                      <span className="text-[8px] font-black text-gray-400 uppercase">
                        By: {rep.reporter?.fullName || "Anonymous"}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-700 font-bold leading-tight italic">
                      "{rep.description || "No additional details provided."}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
