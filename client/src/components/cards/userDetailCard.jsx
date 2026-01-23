import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Star,
  BadgeCheck,
  Send,
  User as UserIcon,
  X,
  MessageSquarePlus,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const API_BASE = process.env.REACT_APP_API_BASE;

export const UserDetailCard = ({ userId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewInput, setShowReviewInput] = useState(false);

  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // We call the SAME POST route but WITH a userId
      const res = await api.get(`/api/user/profile/${userId}`);
      setData(res.data);
    } catch (err) {
      toast.error("User profile unavailable");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (myRating === 0) return toast.error("Please select a star rating");
    setSubmitting(true);
    try {
      await api.post(`/api/user/rate/${userId}`, {
        rating: myRating,
        comment: myComment,
      });
      toast.success("Review submitted!");
      setMyComment("");
      setMyRating(0);
      setShowReviewInput(false);
      fetchProfile();
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason) return toast.error("Please select a reason");
    try {
      await api.post(`/api/user/report`, {
        reportedUserId: userId,
        reason: reportReason,
        description: reportDesc,
      });
      toast.success("User reported");
      setShowReportForm(false);
      setReportReason("");
      setReportDesc("");
    } catch (err) {
      toast.error("Failed to submit report");
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100] flex items-center justify-center">
        <div className="bg-white p-10 rounded-[2rem] font-black animate-pulse text-[#B59353]">
          LOADING...
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
      <div className="bg-[#D1D5DB] rounded-[3rem] w-full max-w-md max-h-[95vh] overflow-y-auto shadow-2xl relative p-6 custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-gray-700 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          {/* Avatar & Verification */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-black bg-white">
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
                <BadgeCheck className="w-4 h-4 md:w-5 md:h-5 text-green-500 fill-white" />
              </span>
            )}
          </div>

          {/* Rating Display */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={20}
                fill={s <= Math.round(data.rating || 0) ? "#FFD700" : "none"}
                color={
                  s <= Math.round(data.rating || 0) ? "#FFD700" : "#9CA3AF"
                }
              />
            ))}
          </div>

          {/* Identity Info - Corrected Address Path */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">
              {data.fullName}
            </h2>
            <div className="flex flex-col items-center gap-1 text-sm font-bold text-gray-800">
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-gray-600" /> {data.phone}
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-gray-600" /> {data.email}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-red-600" />
                {/* Check inside data.kyc for the address */}
                {data.kyc?.address ? data.kyc.address : "Location not verified"}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-8 w-full py-4 border-y border-gray-400/30">
            <div>
              <div className="text-xl font-black">
                {data.stats?.completedDeals || 0}
              </div>
              <div className="text-[10px] font-black uppercase text-gray-700 tracking-tight">
                Deals Completed
              </div>
            </div>
            <div>
              <div className="text-xl font-black">
                {data.stats?.totalProperties || 0}
              </div>
              <div className="text-[10px] font-black uppercase text-gray-700 tracking-tight">
                Properties Listed
              </div>
            </div>
          </div>

          {/* Buttons review and report */}
          <div className="flex items-center gap-3 w-full justify-center">
            
            {!showReviewInput && (
              <button
                onClick={() => {
                  setShowReviewInput(true);
                  setShowReportForm(false); 
                }}
                className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase bg-white px-6 py-3 rounded-full shadow-sm hover:bg-gray-50 transition-all active:scale-95 border-2 border-transparent hover:border-gray-100"
              >
                <MessageSquarePlus size={14} /> Post a Review
              </button>
            )}

            
            {!showReviewInput && (
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                className={`p-3 rounded-full shadow-sm transition-all active:scale-95 border-2 ${
                  showReportForm
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-400 border-transparent hover:border-red-100 hover:text-red-500"
                }`}
                title="Report User"
              >
                <Flag size={18} fill={showReportForm ? "white" : "none"} />
              </button>
            )}
          </div>

          {/* Conditional Rating Input */}
          {showReviewInput && (
            <div className="w-full bg-white rounded-[2rem] p-6 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={24}
                    className="cursor-pointer"
                    fill={s <= myRating ? "#FFD700" : "none"}
                    color={s <= myRating ? "#FFD700" : "#D1D5DB"}
                    onClick={() => setMyRating(s)}
                  />
                ))}
              </div>
              <textarea
                className="w-full bg-[#E5E7EB] rounded-2xl p-4 text-sm border-none focus:ring-0 h-24 resize-none outline-none font-medium"
                placeholder="Type your review here..."
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReviewInput(false)}
                  className="flex-1 py-3 bg-gray-100 rounded-full font-black text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRatingSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#D1D5DB] hover:bg-gray-300 rounded-full font-black text-xs uppercase transition-colors"
                >
                  {submitting ? "..." : "Submit"}
                </button>
              </div>
            </div>
          )}

          {showReportForm && (
            <div className="w-full bg-red-50 rounded-[2rem] p-6 border-2 border-red-100 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2 mb-4 text-red-600">
                <AlertTriangle size={20} />
                <span className="font-black text-xs uppercase tracking-tighter">
                  Report this User
                </span>
              </div>

              <select
                className="w-full bg-white rounded-xl p-3 text-xs font-bold border-none mb-3 outline-none"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select a reason...</option>
                <option value="scam">Scam / Fraud</option>
                <option value="harassment">Harassment</option>
                <option value="fake_profile">Fake Profile</option>
                <option value="other">Other</option>
              </select>

              <textarea
                className="w-full bg-white rounded-xl p-3 text-xs font-medium border-none h-20 resize-none mb-3 outline-none"
                placeholder="Briefly describe the issue..."
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 py-2 font-black text-[10px] uppercase text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportSubmit}
                  className="flex-1 py-2 bg-red-500 text-white rounded-full font-black text-[10px] uppercase"
                >
                  Submit Report
                </button>
              </div>
            </div>
          )}

          {/* Review List Section */}
          <div className="w-full bg-white rounded-[2.5rem] p-6 min-h-[200px]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-left px-2">
              List of Reviews
            </h3>
            <div className="space-y-4">
              {data.reviews.length === 0 ? (
                <div className="text-xs text-gray-300 italic py-10">
                  No reviews yet
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
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={8}
                            fill={i < rev.rating ? "#FFD700" : "none"}
                            color={i < rev.rating ? "#FFD700" : "#D1D5DB"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-600 font-medium leading-relaxed italic">
                      "{rev.comment}"
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
