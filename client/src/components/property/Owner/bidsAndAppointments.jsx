import React, { useState, useEffect } from "react";
import { Trash2, User as UserIcon, CheckCircle2, Clock } from "lucide-react";
import api from "../../../api/axios";

const API_BASE = process.env.REACT_APP_API_BASE;

export const BidsAndAppointments = ({ isOpen, onClose, property, refresh }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const isPropertyClosed = property?.status !== "available";

  useEffect(() => {
    if (isOpen && property) {
      fetchData();
    }
  }, [isOpen, property]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = property.isBidding 
        ? `/api/bookings/bids/${property.id}` 
        : `/api/bookings/appointments/${property.id}`;
      const res = await api.get(endpoint);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this entry?")) return;
    try {
      const type = property.isBidding ? 'bid' : 'appointment';
      await api.delete(`/api/bookings/${type}/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleFinalize = async (userId) => {
    if (!window.confirm("Finalize deal with this user?")) return;
    try {
      await api.post(`/api/bookings/finalize`, {
        propertyId: property.id,
        buyerId: userId
      });
      refresh(); 
      onClose(); 
    } catch (err) {
      alert(err.response?.data?.message || "Finalization failed");
    }
  };

  const handleEndBidding = async () => {
    if (window.confirm("End bidding and pick highest bidder?")) {
      try {
        await api.post(`/api/bookings/end-bid/${property.id}`);
        refresh();
        onClose();
      } catch (err) {
        alert("Failed to end bidding");
      }
    }
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900">
              {property.isBidding ? "Bidding History" : "Viewing Appointments"}
            </h2>
            {isPropertyClosed && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full">
                {property.listedFor === 'sell' ? 'Sold' : 'Rented'}
              </span>
            )}
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="text-center py-10 font-bold animate-pulse">Fetching details...</div>
          ) : data.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-bold italic">No interest shown yet</div>
          ) : (
            data.map((item) => {
              const user = item.User;
              const isWinner = item.status === "accepted";
              // Handle avatar path from User -> Kyc -> avatar
              const avatarPath = user.Kyc?.image ? `${API_BASE}/${user.Kyc.image}` : null;

              return (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isWinner ? 'bg-green-50 border-green-200 ring-2 ring-green-100' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {avatarPath ? (
                        <img src={avatarPath} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-gray-200">
                          <UserIcon size={20} />
                        </div>
                      )}
                      {isWinner && (
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-black text-gray-900 text-sm">{user.fullName}</h4>
                      <p className="text-[10px] text-yellow-600 font-black">★ {user.rating || "5.0"}</p>
                      {property.isBidding && (
                        <p className="text-sm font-black text-[#B59353]">NPR {Number(item.bidAmount).toLocaleString()}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isPropertyClosed ? (
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${isWinner ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {isWinner ? (property.listedFor === 'sell' ? 'Sold' : 'Rented') : 'Closed'}
                      </span>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleFinalize(user.id)}
                          className="px-4 py-2 bg-[#B59353] hover:bg-[#a68546] text-white rounded-xl text-[11px] font-black transition-all"
                        >
                          {property.isBidding ? "Accept Bid" : "Finalize Deal"}
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex flex-col gap-4 mt-auto">
          {/* Deadline View */}
          {!isPropertyClosed && property.isBidding && (
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-yellow-100 border border-yellow-200 rounded-xl text-yellow-800 font-black text-xs uppercase tracking-wider">
              <Clock size={14} />
              DEADLINE: {new Date(property.biddingEndsAt).toLocaleString()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            {property.isBidding && !isPropertyClosed ? (
              <button 
                onClick={handleEndBidding}
                className="flex-1 py-3 px-6 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-200 uppercase"
              >
                End Bidding Session
              </button>
            ) : (
              <div className="flex-1" /> 
            )}
            
            <button 
              onClick={onClose}
              className="py-3 px-10 border-2 border-gray-200 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-100 transition-colors uppercase"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};