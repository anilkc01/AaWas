import React, { useState, useEffect } from "react";
import { X, Eye, ChevronLeft, ChevronRight, User as UserIcon } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function KycPage() {
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchKycs();
    setCurrentPage(1); // Reset page when switching tabs
  }, [currentStatus]);

  const fetchKycs = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/admin/kycs", { status: currentStatus });
      setKycs(res.data);
    } catch (err) {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    try {
      await api.patch(`/api/admin/kyc-status/${selectedKyc.id}`, { 
        status, 
        remarks: status === 'rejected' ? remarks : "Verified by Admin" 
      });
      toast.success(`KYC ${status}`);
      setSelectedKyc(null);
      setShowRejectInput(false);
      setRemarks("");
      fetchKycs();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = kycs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(kycs.length / itemsPerPage);

  return (
    <div className="space-y-6 pb-6 px-2 min-h-[calc(100vh-120px)] flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-black text-black uppercase tracking-tight">KYC Verification</h1>
        
        <div className="flex bg-white p-1.5 rounded-2xl border-2 border-gray-100 shadow-sm">
          {["pending", "rejected", "verified"].map((s) => (
            <button
              key={s}
              onClick={() => setCurrentStatus(s)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                currentStatus === s ? "bg-[#B59353] text-white shadow-md" : "text-gray-400 hover:text-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border-b-8 border-gray-100 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b-2 border-gray-100">
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Submitted Date</th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-24 text-center">
                    <div className="animate-pulse font-black text-[#B59353] uppercase tracking-[0.2em]">Analyzing Records...</div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-24 text-center font-bold text-gray-300 italic">No {currentStatus} requests found.</td>
                </tr>
              ) : currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                        <img src={`${API_BASE}/${item.image}`} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="font-black text-black text-base">{item.fullName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-800 text-sm">{item.email}</p>
                    <p className="text-[11px] font-black text-[#B59353]">{item.phone}</p>
                  </td>
                  <td className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase">
                    {new Date(item.updatedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => setSelectedKyc(item)} 
                      className="p-3 bg-gray-100 text-gray-400 rounded-xl hover:bg-[#B59353] hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      <Eye size={18} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section (Solid footer) */}
        <div className="px-2 py-2 bg-gray-50/50 flex items-center justify-between border-t border-gray-100 mt-auto">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Requests: <span className="text-black">{indexOfFirstItem + 1}</span> - <span className="text-black">{Math.min(indexOfLastItem, kycs.length)}</span> of {kycs.length}
          </p>
          
          <div className="flex items-center gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-2xl border-2 border-gray-200 bg-white hover:border-[#B59353] disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                    currentPage === i + 1 
                    ? "bg-[#B59353] text-white shadow-lg shadow-[#B59353]/30" 
                    : "bg-white border-2 border-gray-100 text-gray-400 hover:text-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-2xl border-2 border-gray-200 bg-white hover:border-[#B59353] disabled:opacity-20 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL (Kept centered and blurred) --- */}
      {selectedKyc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1500] flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-lg rounded-[3.5rem] p-8 relative flex flex-col shadow-2xl border-4 border-white/20 animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
            
            <button onClick={() => setSelectedKyc(null)} className="absolute top-8 right-8 text-black hover:bg-gray-100 p-2 rounded-full transition-all">
              <X size={24} strokeWidth={3} />
            </button>

            <div className="flex flex-col items-center mt-6">
              <div className="w-24 h-24 rounded-full border-2 border-black bg-white overflow-hidden mb-4">
                <img src={`${API_BASE}/${selectedKyc.image}`} className="w-full h-full object-cover" alt="" />
              </div>
              <h3 className="font-black text-2xl text-black uppercase text-center">{selectedKyc.fullName}</h3>
              <div className="mt-2 text-center">
                <p className="text-xs font-bold text-gray-500">{selectedKyc.email}</p>
                <p className="text-[10px] font-black text-[#B59353] mt-1 uppercase italic">{selectedKyc.address}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Identity Document: {selectedKyc.idType}</p>
              <div className="aspect-video w-full bg-gray-50 rounded-[2rem] border-2 border-black overflow-hidden relative group">
                <img src={`${API_BASE}/${selectedKyc.documentImage}`} className="w-full h-full object-contain" alt="Document" />
                <a href={`${API_BASE}/${selectedKyc.documentImage}`} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-[10px] font-black uppercase bg-white text-black px-4 py-2 rounded-full">Zoom Image</span>
                </a>
              </div>
            </div>

            {showRejectInput ? (
              <div className="mt-6">
                <textarea
                  className="w-full bg-gray-50 text-black text-sm font-bold p-4 rounded-2xl border-2 border-gray-200 h-24 outline-none focus:border-red-500 transition-colors"
                  placeholder="Enter rejection reason..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setShowRejectInput(false)} className="flex-1 py-4 text-[10px] font-black uppercase bg-gray-100 rounded-full">Back</button>
                  <button onClick={() => handleAction('rejected')} className="flex-[2] py-4 text-[10px] font-black uppercase bg-red-600 text-white rounded-full">Reject Request</button>
                </div>
              </div>
            ) : (
              <div className="mt-10 flex gap-4">
                <button onClick={() => setShowRejectInput(true)} className="flex-1 bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 py-5 rounded-[2rem] font-black text-xs uppercase transition-all">Reject</button>
                <button onClick={() => handleAction('verified')} className="flex-1 bg-green-600 text-white shadow-lg shadow-green-900/20 hover:bg-green-700 py-5 rounded-[2rem] font-black text-xs uppercase transition-all">Verify User</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}