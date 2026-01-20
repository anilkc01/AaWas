import { useState, useEffect } from "react";
import { Search, X, ArrowUpDown, Filter, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import UserPropertyCard from "../components/property/User/UserPropertyCard";

export default function GuestBrowse() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  
  const [filters, setFilters] = useState({
    propertyType: "all",
    listedFor: "all",
    minPrice: "",
    maxPrice: "",
    minBeds: "",
    minKitchen: "",
    minLiving: "",
    minWashroom: "",
    isBidding: false,
  });

  useEffect(() => { fetchProperties(); }, []);
  useEffect(() => { applyFiltersAndSearch(); }, [properties, searchQuery, filters, sortBy]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/properties/browse");
      setProperties(res.data);
    } catch (error) { 
      console.error("Error fetching properties:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...properties];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => 
        p.location.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    if (filters.propertyType !== "all") filtered = filtered.filter((p) => p.propertyType === filters.propertyType);
    if (filters.listedFor !== "all") filtered = filtered.filter((p) => p.listedFor === filters.listedFor);
    if (filters.minPrice) filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
    if (filters.minBeds) filtered = filtered.filter((p) => p.beds >= Number(filters.minBeds));
    if (filters.minKitchen) filtered = filtered.filter((p) => p.kitchen >= Number(filters.minKitchen));
    if (filters.minLiving) filtered = filtered.filter((p) => p.living >= Number(filters.minLiving));
    if (filters.minWashroom) filtered = filtered.filter((p) => p.washroom >= Number(filters.minWashroom));
    if (filters.isBidding) filtered = filtered.filter((p) => p.isBidding === true);

    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => {
    setFilters({
      propertyType: "all", listedFor: "all", minPrice: "", maxPrice: "",
      minBeds: "", minKitchen: "", minLiving: "", minWashroom: "", isBidding: false,
    });
    setSearchQuery("");
  };

  const handleGuestClick = () => {
    toast("Join us to explore full details!", {
      icon: "🏠",
      duration: 3000,
      style: { borderRadius: '15px', background: '#B59353', color: '#fff', fontWeight: 'bold' },
    });
    navigate("/browse?modal=login");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Filters</h2>
        <button onClick={clearFilters} className="text-sm font-bold text-[#B59353] hover:underline">Clear all</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
          <select value={filters.propertyType} onChange={(e) => handleFilterChange("propertyType", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#B59353]">
            <option value="all">All Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="room">Room</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Listed For</label>
          <select value={filters.listedFor} onChange={(e) => handleFilterChange("listedFor", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#B59353]">
            <option value="all">All</option>
            <option value="sell">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Price Range (NPR)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange("minPrice", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-[#B59353]" />
            <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange("maxPrice", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-[#B59353]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Rooms</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Beds" value={filters.minBeds} onChange={(e) => handleFilterChange("minBeds", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
            <input type="number" placeholder="Kitchen" value={filters.minKitchen} onChange={(e) => handleFilterChange("minKitchen", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
            <input type="number" placeholder="Living" value={filters.minLiving} onChange={(e) => handleFilterChange("minLiving", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
            <input type="number" placeholder="Washroom" value={filters.minWashroom} onChange={(e) => handleFilterChange("minWashroom", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="bidding" checked={filters.isBidding} onChange={(e) => handleFilterChange("isBidding", e.target.checked)} className="w-5 h-5 accent-[#B59353]" />
          <label htmlFor="bidding" className="text-sm font-bold text-gray-700">Bidding only</label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 w-full min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Explore Properties</h1>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28 border border-gray-100">
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <div className={`fixed inset-0 z-[100] lg:hidden transition-opacity ${showFilters ? "opacity-100 visible" : "opacity-0 invisible"}`}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
            <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-8 transition-transform duration-300 transform ${showFilters ? "translate-y-0" : "translate-y-full"}`}>
              <FilterContent />
              <button onClick={() => setShowFilters(false)} className="w-full bg-[#B59353] text-white font-bold py-4 rounded-xl mt-6">Apply Filters</button>
            </div>
          </div>

          <main className="flex-1 min-w-0">
            <div className="flex gap-2 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none font-semibold text-sm focus:border-[#B59353]"
                />
                {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><X size={18} /></button>}
              </div>

              <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl shadow-sm text-[#B59353]"><Filter size={20} /></button>

              <div className="relative">
                <button onClick={() => setShowSortMenu(!showSortMenu)} className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl shadow-sm text-[#B59353]"><ArrowUpDown size={20} /></button>
                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-2">
                    {['newest', 'price-low', 'price-high'].map((m) => (
                      <button key={m} onClick={() => { setSortBy(m); setShowSortMenu(false); }} className={`w-full text-left px-4 py-3 text-sm font-bold ${sortBy === m ? "text-[#B59353] bg-gray-50" : "text-gray-700"}`}>
                        {m === 'newest' ? 'Newest First' : m === 'price-low' ? 'Price: Low-High' : 'Price: High-Low'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center font-bold text-gray-400 animate-pulse">Loading properties...</div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">No properties found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((p) => (
                  <UserPropertyCard key={p.id} property={p} onClick={handleGuestClick} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}