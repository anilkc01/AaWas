import React, { useState, useEffect } from "react";
import { Trash2, User as UserIcon, Star, CheckCircle2, MessageSquare, X } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";
import { UserDetailCard } from "../../cards/userDetailCard";


const API_BASE = process.env.REACT_APP_API_BASE;

export const Appointments = ({ isOpen, onClose, property, refresh }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // New State to handle the Detailed Profile Card
  const [selectedUserId, setSelectedUserId] = useState(null);

  const isAvailable = property?.status === "available";

  useEffect(() => {
    if (isOpen && property) fetchAppointments();
  }, [isOpen, property]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/bookings/appointments/${property.id}`);
      setAppointments(res.data);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (appointmentId) => {
    try {
      const res = await api.put("/api/bookings/appointment/move", { appointmentId });
      toast.success(res.data.message);
      if (res.data.isFinalized) {
        refresh();
        onClose();
      } else {
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this appointment from your list?")) return;
    try {
      await api.delete(`/api/bookings/appointment/${id}`);
      toast.success("Appointment removed");
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to remove appointment");
    }
  };

  const renderStars = (currentRating) => {
    const r = Math.round(currentRating || 0);
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={10}
            fill={star <= r ? "#B59353" : "#E5E7EB"}
            stroke="none"
          />
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 text-left">
        <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Viewings & Deals</h2>
              {!isAvailable && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full">
                  {property.status}
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* List Content */}
          <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
            {loading ? (
              <div className="text-center py-10 font-black animate-pulse text-[#B59353]">LOADING...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-10 text-gray-400 font-bold italic">No appointments requested</div>
            ) : (
              appointments.map((item) => {
                const deal = item.Property?.Deal;
                const isWinner = !isAvailable && deal?.buyerId === item.userId;

                return (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all 
                      ${isWinner ? 'bg-green-50 border-green-200 ring-2 ring-green-50' : 'bg-white border-gray-100 shadow-sm'}
                      ${!isAvailable && !isWinner ? 'opacity-60 grayscale-[0.3]' : ''}`}
                  >
                    {/* CLICKABLE USER PROFILE SECTION */}
                    <div 
                      className="flex items-center gap-4 cursor-pointer group" 
                      onClick={() => setSelectedUserId(item.userId)}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#B59353] transition-colors">
                          {item.User?.Kyc?.image ? (
                            <img src={`${API_BASE}/${item.User.Kyc.image}`} className="w-full h-full object-cover" alt="user" />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                              <UserIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <MessageSquare size={10} className="text-[#B59353]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-sm group-hover:text-[#B59353] transition-colors">{item.User.fullName}</h4>
                        <div className="mt-1">{renderStars(item.User.rating)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isAvailable ? (
                        <>
                          <button 
                            onClick={() => handleMove(item.id)}
                            className="px-5 py-2 bg-[#B59353] text-white rounded-xl text-[10px] font-black uppercase hover:shadow-lg transition-all active:scale-95"
                          >
                            {item.status === 'pending' && "Confirm"}
                            {item.status === 'confirmed' && "Mark Completed"}
                            {item.status === 'completed' && (property.listedFor === 'sell' ? "Sell Now" : "Rent Now")}
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        isWinner && (
                          <span className="text-[10px] font-black text-green-600 uppercase border-2 border-green-200 px-3 py-1 rounded-lg bg-white flex items-center gap-1">
                            <CheckCircle2 size={12} /> {property.listedFor === 'sell' ? 'Sold' : 'Rented'}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* CALLING THE USER DETAIL CARD AS AN OVERLAY */}
      {selectedUserId && (
        <UserDetailCard 
          userId={selectedUserId} 
          onClose={() => {
            setSelectedUserId(null);
            fetchAppointments(); // Refresh list to catch new average ratings
          }} 
        />
      )}
    </>
  );
};