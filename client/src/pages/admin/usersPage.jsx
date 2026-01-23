import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  ShieldEllipsis,
  User as UserIcon,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { AdminUserDetailCard } from "../../components/cards/AdminUserDetailCard";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getKycBadge = (status) => {
    const styles = {
      verified: "bg-green-100 text-green-700",
      pending: "bg-amber-100 text-amber-700",
      rejected: "bg-red-100 text-red-700",
    };
    const icons = {
      verified: <ShieldCheck size={14} strokeWidth={3} />,
      pending: <ShieldEllipsis size={14} strokeWidth={3} />,
      rejected: <ShieldAlert size={14} strokeWidth={3} />,
    };
    return (
      <span
        className={`${styles[status] || "bg-gray-100 text-gray-500"} px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 w-fit border border-current/10`}
      >
        {icons[status] || null} {status || "No KYC"}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-6 px-2 min-h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-black text-black uppercase tracking-tight">
          Registered Users
        </h1>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search name, email, or phone..."
            className="w-full pl-12 pr-4 py-4 bg-white border-4 border-gray-100 rounded-3xl focus:border-[#B59353] focus:outline-none font-bold shadow-sm transition-all text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border-b-8 border-gray-100 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b-2 border-gray-100">
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  User Details
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Contact
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Address
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  KYC Status
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Account
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center font-black text-[#B59353] uppercase tracking-widest"
                  >
                    Fetching Data...
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-all"
                  >
                    {/* Image + Name Block */}
                    <td className="px-8 py-5">
                      <button
                        onClick={() => setSelectedUserId(user.id)}
                        className="flex items-center gap-4 text-left group"
                      >
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm shrink-0 group-hover:border-[#B59353] transition-colors">
                          {user.Kyc?.image ? (
                            <img
                              src={`${API_BASE}/${user.Kyc.image}`}
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <UserIcon size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-black text-lg leading-tight group-hover:text-[#B59353] transition-colors">
                            {user.fullName}
                          </p>
                        </div>
                      </button>
                    </td>

                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-800 text-sm">
                        {user.email}
                      </p>
                      <p className="text-[11px] font-black text-[#B59353]">
                        {user.phone}
                      </p>
                    </td>

                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-500 italic leading-snug max-w-[180px]">
                        {user.Kyc?.address || "Pending Submission"}
                      </p>
                    </td>

                    <td className="px-8 py-5">
                      {getKycBadge(user.Kyc?.status)}
                    </td>

                    {/* Status Badge from User Table */}
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase border ${
                          user.status === "active"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-red-50 text-red-600 border-red-100"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-4 bg-gray-50/50 flex items-center justify-between border-t border-gray-100 mt-auto shrink-0">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Showing <span className="text-black">{indexOfFirstUser + 1}</span> -{" "}
            <span className="text-black">
              {Math.min(indexOfLastUser, filteredUsers.length)}
            </span>{" "}
            of {filteredUsers.length}
          </p>

          <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-2 rounded-xl border-2 border-gray-100 bg-white hover:border-[#B59353] disabled:opacity-20 transition-all text-gray-500"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg font-black text-[10px] transition-all ${
                    currentPage === i + 1
                      ? "bg-[#B59353] text-white shadow-md shadow-[#B59353]/20"
                      : "bg-white border-2 border-gray-50 text-gray-400 hover:text-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-2 rounded-xl border-2 border-gray-100 bg-white hover:border-[#B59353] disabled:opacity-20 transition-all text-gray-500"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {selectedUserId && (
        <AdminUserDetailCard
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
}
