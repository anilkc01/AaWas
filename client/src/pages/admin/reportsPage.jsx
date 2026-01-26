import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Eye,
  User as UserIcon,
  Building2,
  Phone,
  BadgeCheck,
} from "lucide-react";
import api from "../../api/axios";
import { AdminUserDetailCard } from "../../components/cards/AdminUserDetailCard";
import { AdminPropertyDetailCard } from "../../components/cards/AdminPropertyCardDetail";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function ReportsPage() {
  const [type, setType] = useState("user"); // user or property
  const [status, setStatus] = useState("pending"); // pending or resolved
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Detail Modal States
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPropId, setSelectedPropId] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [type, status]);

  const fetchReports = async () => {
    setList([]);
    setLoading(true);
    try {
      const res = await api.post("/api/admin/reports", { type, status });
      setList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-6 px-2 min-h-screen">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-black text-black uppercase tracking-tight">
          Report Center
        </h1>

        {/* 2-Layer Selection */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Layer 1: Target Type */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl border-2 border-gray-200">
            {["user", "property"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${type === t ? "bg-black text-white shadow-lg" : "text-gray-400"}`}
              >
                {t}s
              </button>
            ))}
          </div>

          {/* Layer 2: Resolution Status */}
          <div className="flex bg-white p-1.5 rounded-2xl border-2 border-gray-100 shadow-sm">
            {["pending", "resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${status === s ? (s === "pending" ? "bg-red-500 text-white" : "bg-green-600 text-white") : "text-gray-400"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border-b-8 border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/80 border-b-2 border-gray-100">
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                {type === "user" ? "User Identity" : "Property Asset"}
              </th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Report Count
              </th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                {type === "user" ? "Contact" : "Owner"}
              </th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-20 text-center font-black text-red-500 animate-pulse"
                >
                  FETCHING FLAGS...
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  {/* Photo & Name */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          type === "user"
                            ? item.Kyc?.image
                              ? `${API_BASE}/${item.Kyc.image}`
                              : "/default.png"
                            : item.dpImage
                              ? `${API_BASE}/${item.dpImage}`
                              : "/default-property.png" // Added safety check
                        }
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                        alt="Identity"
                      />
                      <div>
                        <p className="font-black text-black text-sm uppercase">
                          {type === "user" ? item.fullName : item.propertyType}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                          {type === "user"
                            ? item.Kyc?.status === "verified"
                              ? "Verified ID"
                              : "Unverified"
                            : item.location}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Report Badge */}
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full w-fit font-black text-xs">
                      <AlertCircle size={14} /> {item.reportCount}
                    </span>
                  </td>

                  {/* Contact/Owner */}
                  <td className="px-8 py-5 text-[11px] font-bold text-gray-500">
                    {type === "user" ? (
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <Phone size={10} /> {item.phone}
                        </span>
                        <span>{item.email}</span>
                      </div>
                    ) : (
                      <span className="uppercase font-black text-black">
                        {item.User?.fullName}
                      </span>
                    )}
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() =>
                        type === "user"
                          ? setSelectedUserId(item.id)
                          : setSelectedPropId(item.id)
                      }
                      className="p-3 bg-gray-100 text-gray-400 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reusing your high-fidelity cards */}
      {selectedUserId && (
        <AdminUserDetailCard
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onUpdate={fetchReports}
        />
      )}
      {selectedPropId && (
        <AdminPropertyDetailCard
          propertyId={selectedPropId}
          onClose={() => setSelectedPropId(null)}
          onUpdate={fetchReports}
        />
      )}
    </div>
  );
}
