import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import PropertyDetailCard from "../components/property/User/PropertyDetailCard";
import UserPropertyCard from "../components/property/User/UserPropertyCard";
import api from "../api/axios";


const API_BASE = process.env.REACT_APP_API_BASE;

export default function BrowseProperties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states
  const [filters, setFilters] = useState({
    propertyType: "all",
    listedFor: "all",
    minPrice: "",
    maxPrice: "",
    minBeds: "",
    isBidding: false,
  });

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Apply filters and search whenever they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [properties, searchQuery, filters]);

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

    // Search filter (location and description)
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

    // Property type filter
    if (filters.propertyType !== "all") {
      filtered = filtered.filter(
        (p) => p.propertyType === filters.propertyType
      );
    }

    // Listed for filter
    if (filters.listedFor !== "all") {
      filtered = filtered.filter((p) => p.listedFor === filters.listedFor);
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Minimum beds filter
    if (filters.minBeds) {
      filtered = filtered.filter((p) => p.beds >= Number(filters.minBeds));
    }

    // Bidding filter
    if (filters.isBidding) {
      filtered = filtered.filter((p) => p.isBidding === true);
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
      isBidding: false,
    });
    setSearchQuery("");
  };

  return (
    <>
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="p-4 max-w-7xl mx-auto">
          {/* Header with Search */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Browse Properties</h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
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
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
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
                  {/* Property Type */}
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

                  {/* Listed For */}
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

                  {/* Price Range */}
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

                  {/* Minimum Beds */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Minimum Beds
                    </label>
                    <input
                      type="number"
                      placeholder="Any"
                      value={filters.minBeds}
                      onChange={(e) =>
                        handleFilterChange("minBeds", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Bidding */}
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

            {/* Properties Grid */}
            <main className="flex-1">
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

      {/* Property Detail Modal */}
      {selectedPropertyId && (
        <PropertyDetailCard
          propertyId={selectedPropertyId}
          onClose={() => setSelectedPropertyId(null)}
        />
      )}
    </>
  );
}