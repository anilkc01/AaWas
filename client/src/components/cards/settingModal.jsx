import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  X,
  Phone,
  Mail,
  MapPin,
  BadgeCheck,
  User,
  Star,
  ShieldAlert,
  Loader2,
  AlertCircle,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import api from "../../api/axios";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    rePassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default function SettingsModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showReviews, setShowReviews] = useState(false); // Toggle for review list

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          // We call the POST route with NO userId in the body
          const res = await api.get("/api/user/profile");
          setProfileData(res.data);
        } catch (err) {
          toast.error("Failed to load your profile");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetails();
  }, [isOpen]);

  const onSubmitPassword = async (data) => {
    try {
      await api.post("/api/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully!");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  const handleFinalDelete = async () => {
    if (!deletePassword) {
      toast.error("Password is required for deletion");
      return;
    }
    try {
      await api.post("/api/auth/delete-account", { password: deletePassword });
      toast.success("Account deleted. We're sorry to see you go.");
      localStorage.clear();
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Incorrect password");
    }
  };

  if (!isOpen) return null;

  const getImageUrl = () =>
    profileData?.kyc?.image
      ? `${api.defaults.baseURL}/${profileData.kyc.image}`
      : null;

  const isVerified = profileData?.kyc?.verificationStatus === "verified";

  // Helper to render stars based on profile rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={16}
            fill={s <= Math.round(rating || 0) ? "#FFD700" : "none"}
            color={s <= Math.round(rating || 0) ? "#FFD700" : "#D1D5DB"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full z-10"
        >
          <X size={24} className="text-gray-400" />
        </button>

        <div className="overflow-y-auto p-8 md:p-10 no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#B59353]" size={40} />
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    {getImageUrl() ? (
                      <img
                        src={getImageUrl()}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-gray-300" />
                    )}
                  </div>
                  {isVerified && (
                    <span className="absolute -bottom-0 -right-0 bg-white rounded-full p-0.5 shadow">
                      <BadgeCheck className="w-4 h-4 md:w-5 md:h-5 text-green-500 fill-white" />
                    </span>
                  )}
                </div>

                {/* Rating Beneath DP */}
                {renderStars(profileData?.rating)}

                <h2 className="text-3xl font-extrabold mt-2 text-gray-900">
                  {profileData?.fullName || "User"}
                </h2>

                {/* Reviews Toggle Button */}
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase bg-gray-50 px-4 py-2 rounded-full border border-gray-100 hover:bg-gray-100 transition-all"
                >
                  <MessageSquare size={12} />
                  {showReviews
                    ? "Hide Reviews"
                    : `View Reviews (${profileData?.reviews?.length || 0})`}
                </button>

                {/* Reviews List (Conditional) */}
                {showReviews && (
                  <div className="w-full mt-4 bg-gray-50 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-3 border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    {profileData?.reviews?.length > 0 ? (
                      profileData.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="text-left border-b border-gray-200 pb-2 last:border-0 last:pb-0"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-[9px] uppercase">
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
                          <p className="text-[10px] text-gray-600 italic leading-tight">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-gray-400 font-bold italic">
                        No reviews yet.
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-6 space-y-1 text-gray-500 font-semibold text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Phone size={16} className="text-[#B59353]" />
                    <span>{profileData?.phone || "No Phone"}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Mail size={16} className="text-[#B59353]" />
                    <span>{profileData?.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <MapPin size={16} className="text-[#B59353] shrink-0" />
                    <span>
                      {profileData?.kyc?.address || "Address not verified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* KYC Warning */}
              {!isVerified && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className="text-amber-600 shrink-0 mt-0.5"
                      size={20}
                    />
                    <p className="text-sm text-amber-900 font-medium leading-tight">
                      Verify your account to place bids and upload properties.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/kyc");
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-all"
                  >
                    Verify Now <ArrowRight size={16} />
                  </button>
                </div>
              )}

              <div className="h-px bg-gray-100 w-full mb-8" />

              {/* Password Form */}
              <form
                onSubmit={handleSubmit(onSubmitPassword)}
                className="space-y-4"
              >
                <div>
                  <input
                    type="password"
                    placeholder="Old Password"
                    {...register("oldPassword")}
                    className={`w-full bg-gray-100 rounded-xl px-5 py-4 font-bold text-gray-700 outline-none focus:ring-2 ${errors.oldPassword ? "focus:ring-red-500" : "focus:ring-[#B59353]"}`}
                  />
                  {errors.oldPassword && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-bold">
                      {errors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="New Password"
                    {...register("newPassword")}
                    className={`w-full bg-gray-100 rounded-xl px-5 py-4 font-bold text-gray-700 outline-none focus:ring-2 ${errors.newPassword ? "focus:ring-red-500" : "focus:ring-[#B59353]"}`}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-bold">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    {...register("rePassword")}
                    className={`w-full bg-gray-100 rounded-xl px-5 py-4 font-bold text-gray-700 outline-none focus:ring-2 ${errors.rePassword ? "focus:ring-red-500" : "focus:ring-[#B59353]"}`}
                  />
                  {errors.rePassword && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-bold">
                      {errors.rePassword.message}
                    </p>
                  )}
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#FFBB5C] hover:bg-[#F2A93B] text-black font-extrabold py-4 rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Change Password"}
                </button>
              </form>

              {/* Delete Section */}
              <div className="mt-8 pt-4 border-t border-gray-100">
                {!isDeleting ? (
                  <button
                    type="button"
                    onClick={() => setIsDeleting(true)}
                    className="w-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold py-4 rounded-2xl transition-all"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <p className="text-red-700 font-bold mb-3 flex items-center gap-2">
                      <ShieldAlert size={18} /> Confirm Password
                    </p>
                    <input
                      type="password"
                      placeholder="Verify current password"
                      className="w-full bg-white border border-red-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 mb-2 font-bold"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleFinalDelete}
                        className="flex-[2] bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleting(false);
                          setDeletePassword("");
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
