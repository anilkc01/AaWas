import React, { useState, useEffect } from "react";
import { Search, Building2, Eye, MapPin, Filter } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { AdminPropertyDetailCard } from "../../components/cards/AdminPropertyCardDetail";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropId, setSelectedPropId] = useState(null);
  
  // New Status Tab State
  const [currentStatus, setCurrentStatus] = useState("available");

  useEffect(() => { 
    fetchProperties(); 
  }, [currentStatus]); // Refetch when tab changes

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Sending status as a query or body param depending on your API setup
      const res = await api.post("/api/admin/properties", { status: currentStatus });
      setProperties(res.data);
    } catch (err) {
      toast.error("Failed to load property list");
    } finally {
      setLoading(false);
    }
  };

  const filtered = properties.filter(p => 
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.User?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusThemes = {
    available: "bg-green-100 text-green-700 border-green-200",
    unavailable: "bg-gray-100 text-gray-500 border-gray-200",
    rented: "bg-blue-100 text-blue-700 border-blue-200",
    sold: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <div className="space-y-6 pb-6 px-2 min-h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <h1 className="text-4xl font-black text-black uppercase tracking-tight">Assets Management</h1>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Status Tabs */}
          <div className="flex bg-white p-1.5 rounded-2xl border-2 border-gray-100 shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
            {["available", "unavailable", "rented", "sold"].map((s) => (
              <button
                key={s}
                onClick={() => setCurrentStatus(s)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                  currentStatus === s ? "bg-[#B59353] text-white shadow-md" : "text-gray-400 hover:text-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search location, type, or owner..."
              className="w-full pl-12 pr-4 py-4 bg-white border-4 border-gray-100 rounded-3xl focus:border-[#B59353] outline-none font-bold text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border-b-8 border-gray-100 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b-2 border-gray-100">
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Asset Details</th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Owner</th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Valuation</th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Current Status</th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="p-24 text-center font-black text-[#B59353] uppercase tracking-[0.2em] animate-pulse">Syncing Database...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="p-24 text-center font-bold text-gray-300 italic">No {currentStatus} listings found.</td></tr>
              ) : filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                         <img src={`${API_BASE}/${prop.dpImage}`} className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-100 shadow-sm" alt="" />
                         {prop.isBidding && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[8px] font-black px-2 py-1 rounded-lg">BID</span>}
                      </div>
                      <div>
                        <p className="font-black text-black text-base uppercase leading-tight">{prop.propertyType}</p>
                        <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1 mt-1"><MapPin size={12} className="text-[#B59353]"/> {prop.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-black text-sm uppercase">{prop.User?.fullName}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">OWNER ID: #{String(prop.User?.id).padStart(4, '0')}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-black">NPR {Number(prop.price).toLocaleString()}</p>
                    <p className="text-[10px] font-black text-[#B59353] uppercase">{prop.listedFor}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase border ${statusThemes[prop.status]}`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => setSelectedPropId(prop.id)} className="p-3 bg-gray-100 text-gray-400 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-90">
                      <Eye size={18} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPropId && (
        <AdminPropertyDetailCard 
          propertyId={selectedPropId} 
          onClose={() => setSelectedPropId(null)} 
          onUpdate={fetchProperties}
        />
      )}
    </div>
  );
}