import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import PropertyDetailCard from "../components/property/User/PropertyDetailCard";
import UserPropertyCard from "../components/property/User/UserPropertyCard";
import api from "../api/axios";

export default function BrowseProperties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
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

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [properties, searchQuery, filters, sortBy]);

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
      filtered = filtered.filter((property) => {
        const locationMatch = property.location
          .split(",")[0]
          .toLowerCase()
          .includes(query);
        const descriptionMatch = property.description
          ?.toLowerCase()
          .includes(query);
        return locationMatch || descriptionMatch;
      });
    }

    if (filters.propertyType !== "all") {
      filtered = filtered.filter((p) => p.propertyType === filters.propertyType);
    }

    if (filters.listedFor !== "all") {
      filtered = filtered.filter((p) => p.listedFor === filters.listedFor);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
    }

    if (filters.minBeds) {
      filtered = filtered.filter((p) => p.beds >= Number(filters.minBeds));
    }
    if (filters.minKitchen) {
      filtered = filtered.filter((p) => p.kitchen >= Number(filters.minKitchen));
    }
    if (filters.minLiving) {
      filtered = filtered.filter((p) => p.living >= Number(filters.minLiving));
    }
    if (filters.minWashroom) {
      filtered = filtered.filter((p) => p.washroom >= Number(filters.minWashroom));
    }

    if (filters.isBidding) {
      filtered = filtered.filter((p) => p.isBidding === true);
    }

    // Apply sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
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
    setSearchQuery("");
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setShowSortMenu(false);
  };

  return (
    <>
      <div className="pt-16 w-full min-h-screen bg-gray-50">
        <div className="p-4 w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Browse Properties</h1>
          </div>

          <div className="flex gap-6">
            {showFilters && (
              <aside className="w-64 bg-white rounded-lg shadow p-4 h-fit sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Property Type
                    </label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) =>
                        handleFilterChange("propertyType", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="room">Room</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Listed For
                    </label>
                    <select
                      value={filters.listedFor}
                      onChange={(e) =>
                        handleFilterChange("listedFor", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="all">All</option>
                      <option value="sell">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price Range (NPR)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) =>
                          handleFilterChange("minPrice", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          handleFilterChange("maxPrice", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Minimum Rooms
                    </label>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Beds"
                        value={filters.minBeds}
                        onChange={(e) =>
                          handleFilterChange("minBeds", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Kitchen"
                        value={filters.minKitchen}
                        onChange={(e) =>
                          handleFilterChange("minKitchen", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Living/Hall"
                        value={filters.minLiving}
                        onChange={(e) =>
                          handleFilterChange("minLiving", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Washroom"
                        value={filters.minWashroom}
                        onChange={(e) =>
                          handleFilterChange("minWashroom", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="bidding"
                      checked={filters.isBidding}
                      onChange={(e) =>
                        handleFilterChange("isBidding", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor="bidding" className="text-sm">
                      Bidding only
                    </label>
                  </div>
                </div>
              </aside>
            )}

            <main className="flex-1">
              <div className="mb-4 flex gap-3">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by location or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2 px-4 py-3 bg-white border rounded-lg hover:bg-gray-50"
                  >
                    <ArrowUpDown size={18} />
                    <span className="text-sm font-medium">Sort</span>
                  </button>

                  {showSortMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleSortChange("newest")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === "newest" ? "bg-blue-50 text-blue-600" : ""
                        }`}
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => handleSortChange("price-low")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === "price-low" ? "bg-blue-50 text-blue-600" : ""
                        }`}
                      >
                        Price: Low to High
                      </button>
                      <button
                        onClick={() => handleSortChange("price-high")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === "price-high" ? "bg-blue-50 text-blue-600" : ""
                        }`}
                      >
                        Price: High to Low
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-4 py-3 bg-white border rounded-lg"
                >
                  <SlidersHorizontal size={18} />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading properties...</p>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-600">
                    No properties found matching your criteria.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    {filteredProperties.length} properties found
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProperties.map((property) => (
                      <UserPropertyCard
                        key={property.id}
                        property={property}
                        onClick={() => setSelectedPropertyId(property.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      {selectedPropertyId && (
        <PropertyDetailCard
          propertyId={selectedPropertyId}
          onClose={() => setSelectedPropertyId(null)}
        />
      )}
    </>
  );
}