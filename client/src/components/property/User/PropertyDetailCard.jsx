import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  ChefHat,
  Sofa,
  Heart,
  Flag,
  Calendar,
  Gavel,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserDetailCard } from "../../cards/userDetailCard";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function PropertyDetailCard({ propertyId, onClose }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState("");

  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!propertyId) return;
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/properties/browse/${propertyId}`);
      setProperty(res.data);
    } catch (error) {
      console.error("Failed to load property", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      setBidsLoading(true);
      const res = await api.get(`/api/bookings/bids/${propertyId}`);
      setBids(res.data);
    } catch (error) {
      toast.error("Failed to Fetch Bids");
    } finally {
      setBidsLoading(false);
    }
  };

  const ensureKycVerified = async () => {
    try {
      const res = await api.get("/api/kyc/status");
      if (res.data.status !== "verified") {
        toast.info("Please complete KYC to place bids");
        navigate("/kyc");
        return false;
      }
      return true;
    } catch (err) {
      navigate("/kyc");
      return false;
    }
  };

  const handleOpenBidding = async () => {
    const allowed = await ensureKycVerified();
    if (!allowed) return;
    setShowBiddingModal(true);
    await fetchBids();
  };

  const handlePlaceBid = async () => {
    const bidValue = parseFloat(bidAmount);
    setBidError("");

    if (!bidAmount || isNaN(bidValue) || bidValue <= 0) {
      setBidError("Please enter a valid bid amount");
      return;
    }

    const minBid = property.price;
    const highestBid = bids.length > 0 ? parseFloat(bids[0].bidAmount) : 0;

    if (bids.length === 0 && bidValue < minBid) {
      setBidError(`Minimum bid is NPR ${Number(minBid).toLocaleString()}`);
      return;
    }

    if (bids.length > 0 && bidValue <= highestBid) {
      setBidError(`Bid must be higher than NPR ${Number(highestBid).toLocaleString()}`);
      return;
    }

    try {
      setBidLoading(true);
      await api.post(`/api/bookings/bid/${propertyId}`, { bidAmount: bidValue });
      toast.success("Bid placed successfully");
      setBidAmount("");
      setBidError("");
      await fetchBids();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place bid");
    } finally {
      setBidLoading(false);
    }
  };

  const handleAppointmentSubmit = async ({ action }) => {
    try {
      setAppointmentLoading(true);
      let response;

      if (action === "book") {
        response = await api.post(`/api/bookings/appointment/${propertyId}`);
        toast.success(response.data.message);
        setProperty((prev) => ({
          ...prev,
          userAppointment: response.data.appointment || { id: response.data.id || true },
        }));
      }

      if (action === "cancel") {
        response = await api.delete(`/api/bookings/appointment/${property.userAppointment.id}`);
        toast.success(response.data.message);
        setProperty((prev) => ({ ...prev, userAppointment: null }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setAppointmentLoading(false);
    }
  };

  const handleReportSubmit = async () => {
    try {
      setReportLoading(true);
      await api.post(`/api/properties/report/${property.id}`, {
        reason: reportReason,
        message: reportMessage,
      });
      toast.success("Report submitted. Thank you!");
      setShowReportModal(false);
    } catch (err) {
      toast.error("Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };

  if (loading || !property) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg font-black text-[#B59353] animate-pulse uppercase">
          Loading Property...
        </div>
      </div>
    );
  }

  const allImages = [property.dpImage, ...(property.images || [])];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative custom-scrollbar">
        {/* Close Button */}
        <button onClick={onClose} className="fixed top-6 right-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-50">
          <X size={20} />
        </button>

        {/* IMAGE SECTION */}
        <div className="relative bg-black h-80 flex items-center justify-center rounded-t-xl overflow-hidden">
          <img src={`${API_BASE}/${allImages[currentImageIndex]}`} className="max-h-full max-w-full object-contain" alt="Property" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button className={`p-2 rounded-full shadow ${property.isFavourite ? "bg-red-100 text-red-600" : "bg-white text-gray-700"}`}>
              <Heart size={18} fill={property.isFavourite ? "currentColor" : "none"} />
            </button>
            <button onClick={() => setShowReportModal(true)} className="bg-white/90 p-2 rounded-full shadow hover:bg-white">
              <Flag size={18} />
            </button>
          </div>
          {allImages.length > 1 && (
            <>
              <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow">
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">NPR {Number(property.price).toLocaleString()}</h2>
              <div className="flex gap-2 mt-2 text-xs font-black uppercase tracking-tight">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{property.propertyType}</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">For {property.listedFor}</span>
                {property.isBidding && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Bidding</span>}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${property.status === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {property.status}
            </span>
          </div>

          <div className="flex gap-2 text-sm text-gray-600 font-bold">
            <MapPin size={16} className="text-red-500 mt-0.5" />
            {property.location}
          </div>

          {/* OWNER SECTION */}
          {property.User && (
            <div 
              className="flex items-center gap-3 p-3 border-2 border-gray-50 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all active:scale-95"
              onClick={() => setSelectedOwnerId(property.User.id)}
            >
              <img src={property.User.Kyc?.image ? `${API_BASE}/${property.User.Kyc.image}` : "/default-user.png"} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="Owner" />
              <div>
                <div className="text-sm font-black text-gray-900 uppercase tracking-tight">{property.User.fullName}</div>
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Verified Owner</div>
              </div>
            </div>
          )}

          {/* AMENITIES */}
          <div className="grid grid-cols-4 gap-4 py-4 border-y text-center text-[10px] font-black uppercase text-gray-500">
            <div><Bed className="mx-auto mb-1 text-gray-400" size={18} /> {property.beds} Beds</div>
            <div><Sofa className="mx-auto mb-1 text-gray-400" size={18} /> {property.living} Living</div>
            <div><ChefHat className="mx-auto mb-1 text-gray-400" size={18} /> {property.kitchen} Kitchen</div>
            <div><Bath className="mx-auto mb-1 text-gray-400" size={18} /> {property.washroom} Bath</div>
          </div>

          {property.description && (
            <div>
              <h3 className="font-black text-xs uppercase text-gray-400 tracking-widest mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{property.description}</p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="space-y-3 pt-4">
            {property.isBidding ? (
              <button onClick={handleOpenBidding} className="w-full bg-[#B59353] hover:bg-[#a3844a] text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                <Gavel size={18} /> See Current Biddings
              </button>
            ) : property.userAppointment ? (
              <div className="space-y-3">
                <div className="text-[11px] font-black uppercase text-green-700 bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                  Appointment Requested! Owner will contact you.
                </div>
                <button onClick={() => handleAppointmentSubmit({ action: "cancel" })} disabled={appointmentLoading} className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg transition-all disabled:opacity-50">
                  {appointmentLoading ? "CANCELLING..." : "Cancel Appointment"}
                </button>
              </div>
            ) : (
              <button onClick={() => handleAppointmentSubmit({ action: "book" })} disabled={appointmentLoading || property.status !== 'available'} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale">
                <Calendar size={18} />
                {appointmentLoading ? "BOOKING..." : "Book Appointment for Inspection"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-black uppercase text-gray-900">Report Property</h2>
            <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-red-500 outline-none">
              <option value="">Select reason</option>
              <option value="fake_listing">Fake listing</option>
              <option value="scam">Scam</option>
              <option value="wrong_price">Wrong price</option>
              <option value="other">Other</option>
            </select>
            <textarea rows={3} value={reportMessage} onChange={(e) => setReportMessage(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-red-500 outline-none resize-none" placeholder="Details (optional)" />
            <div className="flex gap-3">
              <button onClick={() => setShowReportModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-black uppercase text-[10px]">Cancel</button>
              <button onClick={handleReportSubmit} disabled={!reportReason || reportLoading} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] disabled:opacity-50">
                {reportLoading ? "SUBMITTING..." : "SUBMIT REPORT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BIDDING MODAL */}
      {showBiddingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase text-gray-900">Biddings</h2>
              <button onClick={() => setShowBiddingModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {bidsLoading ? (
                <div className="text-center font-black text-xs text-gray-400 py-10 uppercase animate-pulse">Fetching Bids...</div>
              ) : bids.length === 0 ? (
                <div className="text-center font-black text-xs text-gray-400 py-10 uppercase">No bids placed yet</div>
              ) : (
                bids.map((bid) => (
                  <div key={bid.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <div className="font-black text-sm text-gray-900 uppercase">{bid.User.fullName}</div>
                      <div className="text-[10px] font-bold text-gray-400">{new Date(bid.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="font-black text-green-600">NPR {Number(bid.bidAmount).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t-2 border-gray-50 space-y-3">
              <div className="bg-blue-50 p-4 rounded-2xl text-[10px] font-black uppercase text-blue-700 text-center">
                {bids.length === 0 ? `Minimum Bid: NPR ${Number(property.price).toLocaleString()}` : `Next bid must exceed: NPR ${Number(bids[0].bidAmount).toLocaleString()}`}
              </div>
              <div className="flex gap-2">
                <input type="number" value={bidAmount} onChange={(e) => {setBidAmount(e.target.value); setBidError("");}} placeholder="Enter amount" className={`flex-1 border-2 rounded-2xl px-4 py-4 text-sm font-black outline-none transition-all ${bidError ? "border-red-500" : "border-gray-100 focus:border-[#B59353]"}`} />
                <button onClick={handlePlaceBid} disabled={bidLoading || !bidAmount} className="px-6 bg-[#B59353] text-white rounded-2xl font-black uppercase text-[10px] shadow-lg hover:bg-[#a3844a] disabled:opacity-50">
                  {bidLoading ? "..." : "PLACE BID"}
                </button>
              </div>
              {bidError && <p className="text-red-500 text-[10px] font-black uppercase text-center">{bidError}</p>}
            </div>
          </div>
        </div>
      )}

      {/* OWNER DETAIL OVERLAY */}
      {selectedOwnerId && (
        <UserDetailCard userId={selectedOwnerId} onClose={() => setSelectedOwnerId(null)} />
      )}
    </div>
  );
}