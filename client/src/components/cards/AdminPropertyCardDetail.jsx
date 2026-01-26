import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  ChefHat,
  Sofa,
  ShieldCheck,
  Trash2,
  CheckCircle,
  Flag,
  Check,
  AlertCircle,
  Info
} from "lucide-react";
import toast from "react-hot-toast";
import { AdminUserDetailCard } from "./AdminUserDetailCard";

const API_BASE = process.env.REACT_APP_API_BASE;

export const AdminPropertyDetailCard = ({ propertyId, onClose, onUpdate }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);
  const [reports, setReports] = useState([]);
  const [showReportList, setShowReportList] = useState(false);

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
      fetchPropertyReports();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/property/${propertyId}`);
      setProperty(res.data);
    } catch (error) {
      toast.error("Error loading property");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyReports = async () => {
    try {
      const res = await api.get(`/api/admin/property-reports/${propertyId}`);
      setReports(res.data);
    } catch (e) { console.error(e); }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/api/admin/property/${propertyId}`, { status: newStatus });
      toast.success(`Updated to ${newStatus}`);
      fetchProperty();
      onUpdate?.();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await api.patch(`/api/admin/property-report/${reportId}`, { status: "resolved" });
      toast.success("Resolved");
      fetchPropertyReports();
      onUpdate?.();
    } catch (e) { toast.error("Failed"); }
  };

  if (loading || !property) return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1200]">
      <div className="bg-white px-6 py-4 rounded-2xl font-black text-[#B59353] animate-pulse uppercase text-sm">Analyzing Asset...</div>
    </div>
  );

  const allImages = [property.dpImage, ...(property.images || [])];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1200] p-4">
      <div className="bg-white rounded-[2rem] max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border-2 border-white custom-scrollbar">
        
        <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 rounded-full p-1.5 shadow-md z-50 hover:bg-white active:scale-90 transition-all">
          <X size={20} strokeWidth={3} />
        </button>

        {/* Compact Slider */}
        <div className="relative bg-gray-900 h-64 flex items-center justify-center overflow-hidden">
          <img src={`${API_BASE}/${allImages[currentImageIndex]}`} className="max-h-full max-w-full object-contain" alt="Property" />
          <div className="absolute bottom-3 right-4 bg-black/60 px-2 py-0.5 rounded text-[9px] text-white font-black">{currentImageIndex + 1}/{allImages.length}</div>
          {allImages.length > 1 && (
            <>
              <button onClick={() => setCurrentImageIndex(p => p === 0 ? allImages.length - 1 : p - 1)} className="absolute left-2 bg-white/10 p-2 rounded-full text-white hover:bg-white/90 hover:text-black transition-all"><ChevronLeft size={20}/></button>
              <button onClick={() => setCurrentImageIndex(p => p === allImages.length - 1 ? 0 : p + 1)} className="absolute right-2 bg-white/10 p-2 rounded-full text-white hover:bg-white/90 hover:text-black transition-all"><ChevronRight size={20}/></button>
            </>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Price & Badge */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-black tracking-tight">NPR {Number(property.price).toLocaleString()}</h2>
              <div className="flex gap-1.5 mt-1 text-[9px] font-black uppercase">
                <span className="px-2 py-0.5 bg-gray-100 rounded border">{property.propertyType}</span>
                <span className="px-2 py-0.5 bg-[#B59353]/10 text-[#B59353] rounded border border-[#B59353]/20">For {property.listedFor}</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase border-2 ${property.status === "available" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
              {property.status}
            </div>
          </div>

          <div className="flex gap-2 text-xs text-gray-700 font-bold bg-gray-50 p-3 rounded-xl border border-gray-100 items-center">
            <MapPin size={16} className="text-red-500 shrink-0" /> {property.location}
          </div>

          {/* Description - Tightened */}
          <div className="space-y-1">
            <h4 className="text-[9px] font-black uppercase text-gray-400 flex items-center gap-1.5"><Info size={12}/> Description</h4>
            <p className="text-[11px] text-gray-600 leading-snug font-medium line-clamp-3 hover:line-clamp-none cursor-pointer transition-all">{property.description || "No description provided."}</p>
          </div>

          {/* Amenities Grid - Compact */}
          <div className="grid grid-cols-4 gap-2 py-4 border-y border-gray-100 text-center text-[9px] font-black uppercase text-gray-500">
            <div className="space-y-0.5"><Bed className="mx-auto text-black" size={18}/> <p>{property.beds} Bed</p></div>
            <div className="space-y-0.5"><Sofa className="mx-auto text-black" size={18}/> <p>{property.living} Living</p></div>
            <div className="space-y-0.5"><ChefHat className="mx-auto text-black" size={18}/> <p>{property.kitchen} Kit</p></div>
            <div className="space-y-0.5"><Bath className="mx-auto text-black" size={18}/> <p>{property.washroom} Bath</p></div>
          </div>

          {/* Owner & Reports Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border hover:border-[#B59353] cursor-pointer transition-all" onClick={() => setSelectedOwnerId(property.User?.id)}>
              <img src={property.User?.Kyc?.image ? `${API_BASE}/${property.User.Kyc.image}` : "/default-user.png"} className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm" alt="" />
              <div>
                <div className="text-xs font-black text-black uppercase leading-none">{property.User?.fullName}</div>
                <div className="text-[8px] text-gray-400 font-black uppercase mt-1">Verified Owner</div>
              </div>
            </div>
            <button onClick={() => setShowReportList(!showReportList)} className={`p-3.5 rounded-2xl border transition-all relative ${showReportList ? "bg-red-500 text-white shadow-lg" : "bg-white text-gray-400 hover:text-red-500"}`}>
              <Flag size={18} fill={showReportList ? "white" : "none"} />
              {reports.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">{reports.length}</span>}
            </button>
          </div>

          {/* Reports Collapsible - Compact */}
          {showReportList && (
            <div className="space-y-2 pt-1 animate-in slide-in-from-top-1">
              {reports.length === 0 ? <p className="text-[10px] text-center py-2 text-gray-400 font-bold">No active reports</p> : 
                reports.map(rep => (
                  <div key={rep.id} className="bg-red-50 border border-red-100 rounded-2xl p-3 flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] font-black uppercase text-red-600 bg-white px-1.5 py-0.5 rounded border border-red-100">{rep.reason?.replace("_", " ")}</span>
                        <span className="text-[8px] font-black text-gray-400">By: {rep.User?.fullName}</span>
                      </div>
                      <p className="text-[10px] text-gray-700 font-bold italic">"{rep.message}"</p>
                    </div>
                    <button onClick={() => handleResolveReport(rep.id)} className="p-1.5 bg-white text-gray-400 rounded-full hover:bg-green-500 hover:text-white transition-all"><Check size={14} strokeWidth={4} /></button>
                  </div>
                ))
              }
            </div>
          )}

          {/* Action Center - Unified & Minimal */}
          <div className="bg-gray-100 rounded-[2rem] p-5 space-y-3">
            <div className="flex gap-2">
              <button 
                onClick={() => handleStatusUpdate(property.listedFor === 'sell' ? 'sold' : 'rented')}
                disabled={actionLoading || property.status === 'sold' || property.status === 'rented'}
                className="flex-[1.5] bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase hover:shadow-sm disabled:opacity-50 transition-all"
              >
                Mark {property.listedFor === 'sell' ? 'Sold' : 'Rented'}
              </button>

              {property.status === 'available' ? (
                <button onClick={() => handleStatusUpdate('unavailable')} disabled={actionLoading} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-1.5 hover:bg-red-700 transition-all"><Trash2 size={14}/> Disable</button>
              ) : (
                <button onClick={() => handleStatusUpdate('available')} disabled={actionLoading} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-1.5 hover:bg-green-700 transition-all"><CheckCircle size={14}/> Enable</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedOwnerId && <AdminUserDetailCard userId={selectedOwnerId} onClose={() => setSelectedOwnerId(null)} onUpdate={fetchProperty} />}
    </div>
  );
};