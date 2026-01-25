import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, MapPin, Calendar, Edit2, Camera } from "lucide-react";

const API_BASE = "";

export const ViewProfileDialog = ({ isOpen, onClose, onEdit }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[700px] max-h-[95vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 sm:px-8 sm:py-6 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            My Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={28} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#B59353] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm font-bold text-gray-400">Loading profile...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-2 border-red-100 text-red-700 px-4 py-3 rounded-2xl font-black text-sm">
              {error}
            </div>
          ) : profile ? (
            <>
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg bg-gradient-to-br from-[#B59353] to-[#d4af6a]">
                    {profile.profileImage ? (
                      <img
                        src={`${API_BASE}/${profile.profileImage}`}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={64} className="text-white" />
                      </div>
                    )}
                  </div>
                  {onEdit && (
                    <button
                      onClick={() => {
                        onClose();
                        onEdit(profile);
                      }}
                      className="absolute bottom-2 right-2 p-2 bg-[#B59353] text-white rounded-full shadow-xl hover:bg-[#a68546] transition-all"
                    >
                      <Camera size={20} />
                    </button>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mt-4">
                  {profile.name || 'User'}
                </h3>
                <p className="text-sm font-bold text-gray-400 mt-1">
                  Member since {formatDate(profile.createdAt)}
                </p>
              </div>

              {/* Profile Information Cards */}
              <div className="space-y-4">
                {/* Email */}
                <div className="p-5 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-[#B59353]/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Mail size={24} className="text-[#B59353]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                        Email Address
                      </p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        {profile.email || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                {profile.phone && (
                  <div className="p-5 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-[#B59353]/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Phone size={24} className="text-[#B59353]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                          Phone Number
                        </p>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                          {profile.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address */}
                {profile.address && (
                  <div className="p-5 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-[#B59353]/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <MapPin size={24} className="text-[#B59353]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                          Address
                        </p>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                          {profile.address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bio/Description */}
                {profile.bio && (
                  <div className="p-5 bg-gray-50 rounded-2xl border-2 border-gray-100">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                      About Me
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Account Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-gradient-to-br from-[#B59353] to-[#d4af6a] rounded-2xl text-center">
                    <p className="text-2xl sm:text-3xl font-black text-white">
                      {profile.propertiesCount || 0}
                    </p>
                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider mt-1">
                      Properties
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl text-center">
                    <p className="text-2xl sm:text-3xl font-black text-white">
                      {profile.bidsCount || 0}
                    </p>
                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider mt-1">
                      Bids Placed
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        {!loading && !error && onEdit && (
          <div className="p-6 sm:px-10 sm:py-6 border-t bg-white sticky bottom-0 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 z-20">
            <button
              onClick={onClose}
              className="px-8 py-3 sm:py-4 border-2 border-gray-100 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all text-sm sm:text-base"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(profile);
              }}
              className="px-8 sm:px-12 py-3 sm:py-4 bg-[#B59353] text-white rounded-2xl font-black hover:bg-[#a68546] transition-all shadow-xl shadow-[#B59353]/20 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Edit2 size={20} />
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};