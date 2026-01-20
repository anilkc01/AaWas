import React, { useState, useEffect } from "react";
import { Trash2, User as UserIcon, Clock, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const API_BASE = process.env.REACT_APP_API_BASE;

export const Bidders = ({ isOpen, onClose, property, refresh }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAvailable = property?.status === "available";

  useEffect(() => {
    if (isOpen && property) fetchBids();
  }, [isOpen, property]);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/bookings/bids/${property.id}`);
      setBids(res.data);
    } catch (err) {
      toast.error("Failed to load bids");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bidId) => {
    if (!window.confirm("Remove this bid?")) return;
    try {
      await api.delete(`/api/bookings/bid/${bidId}`);
      toast.success("Bid removed");
      fetchBids();
    } catch (err) {
      toast.error("Failed to delete bid");
    }
  };

  const handleEndBidding = async () => {
    if (!window.confirm("End bidding and finalize with highest bidder?")) return;
    try {
      const res = await api.post(`/api/bookings/end-bid/${property.id}`);
      toast.success(res.data.message);
      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to end bidding");
    }
  };

  const renderStars = (rating) => {
    const r = Math.round(rating || 0);
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={10}
            fill={star <= r ? "#B59353" : "#E5E7EB"}
            color={star <= r ? "#B59353" : "#E5E7EB"}
          />
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 text-left">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Bidding History</h2>
            {!isAvailable && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full">
                {property.status}
              </span>
            )}
          </div>
          <span className="px-3 py-1 bg-[#B59353]/10 text-[#B59353] text-[10px] font-black rounded-full uppercase">
            {bids.length} Bidders
          </span>
        </div>

        {/* List Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="text-center py-10 font-black animate-pulse text-[#B59353]">LOADING BIDS...</div>
          ) : bids.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-bold italic">No bids placed yet</div>
          ) : (
            bids.map((bid, index) => {
              const isWinner = !isAvailable && index === 0;
              return (
                <div 
                  key={bid.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all 
                    ${isWinner ? 'bg-green-50 border-green-200 ring-2 ring-green-50' : 'bg-white border-gray-100 shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {bid.User?.Kyc?.image ? (
                        <img src={`${API_BASE}/${bid.User.Kyc.image}`} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" alt="avatar" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border-2 border-gray-200">
                          <UserIcon size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-sm leading-tight">{bid.User.fullName}</h4>
                      <div className="mt-1">{renderStars(bid.User.rating)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-[#B59353]">NPR {Number(bid.bidAmount).toLocaleString()}</p>
                      {isWinner && <p className="text-[9px] font-black text-green-600 uppercase">Winning Bid</p>}
                    </div>
                    
                    {isAvailable && (
                      <button 
                        onClick={() => handleDelete(bid.id)} 
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex flex-col gap-4">
          {isAvailable ? (
            <>
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-yellow-100 border border-yellow-200 rounded-xl text-yellow-800 font-black text-xs uppercase">
                <Clock size={14} /> DEADLINE: {new Date(property.biddingEndsAt).toLocaleString()}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleEndBidding} 
                  className="flex-1 py-3.5 bg-red-600 text-white rounded-2xl font-black text-sm uppercase shadow-lg shadow-red-100 hover:bg-red-700 transition-colors"
                >
                  End Bidding Now
                </button>
                <button 
                  onClick={onClose} 
                  className="py-3.5 px-10 border-2 border-gray-200 text-gray-500 rounded-2xl font-black text-sm uppercase hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-end">
              <button 
                onClick={onClose} 
                className="py-3.5 px-12 border-2 border-gray-200 text-gray-500 rounded-2xl font-black text-sm uppercase hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};