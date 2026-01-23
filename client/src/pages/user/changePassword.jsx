import React, { useState, useEffect } from "react";
import { X, Lock, Eye, EyeOff, Shield } from "lucide-react";

export const ChangePasswordDialog = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError(null);
      setSuccess(false);
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return false;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      const data = await response.json();
      setSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) onSuccess(data);
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        err.message || 
        "Failed to change password. Please check your current password."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[500px] max-h-[95vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 sm:px-8 sm:py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#B59353]/10 rounded-xl">
              <Shield size={24} className="text-[#B59353]" />
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
              Change Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={28} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto scrollbar-hide">
          {error && (
            <div className="bg-red-50 border-2 border-red-100 text-red-700 px-4 py-3 rounded-2xl font-black text-sm animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-100 text-green-700 px-4 py-3 rounded-2xl font-black text-sm animate-in fade-in slide-in-from-top-2">
              Password changed successfully! 🎉
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-black text-gray-700 uppercase tracking-widest">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full pl-14 pr-14 py-4 border-2 border-gray-100 rounded-2xl focus:border-[#B59353] outline-none font-bold text-gray-700"
                placeholder="Enter current password"
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-black text-gray-700 uppercase tracking-widest">
              New Password
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full pl-14 pr-14 py-4 border-2 border-gray-100 rounded-2xl focus:border-[#B59353] outline-none font-bold text-gray-700"
                placeholder="Enter new password"
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs font-bold text-gray-400 pl-1">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-black text-gray-700 uppercase tracking-widest">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-14 pr-14 py-4 border-2 border-gray-100 rounded-2xl focus:border-[#B59353] outline-none font-bold text-gray-700"
                placeholder="Confirm new password"
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Security Tips */}
          <div className="p-4 sm:p-5 bg-blue-50 rounded-2xl border-2 border-blue-100">
            <p className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2">
              Security Tips
            </p>
            <ul className="space-y-1 text-xs font-bold text-blue-700">
              <li>• Use a mix of letters, numbers, and symbols</li>
              <li>• Avoid common words or personal information</li>
              <li>• Don't reuse passwords from other accounts</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:px-10 sm:py-6 border-t bg-white sticky bottom-0 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 z-20">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-8 py-3 sm:py-4 border-2 border-gray-100 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all text-sm sm:text-base disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className="px-8 sm:px-12 py-3 sm:py-4 bg-[#B59353] text-white rounded-2xl font-black hover:bg-[#a68546] disabled:opacity-50 transition-all shadow-xl shadow-[#B59353]/20 text-sm sm:text-base"
          >
            {loading ? "Changing..." : success ? "Changed!" : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
};