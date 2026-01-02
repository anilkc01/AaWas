import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import KycForm from "../components/Kyc/kycForm";
import PropertyCard from "../components/property/PropertyCard";
import AddPropertyCard from "../components/property/AddPropertyCard";
import { AddPropertyDialog } from "../components/property/AddPropertyDialog";
import { Search, SlidersHorizontal, Grid, List } from "lucide-react";

export default function MyProperties({ filters = {} }) {
  const [kycStatus, setKycStatus] = useState("loading");
  const [properties, setProperties] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------- KYC ---------------- */
  const fetchKycStatus = async () => {
    try {
      const res = await api.get("/api/kyc/status");
      setKycStatus(res.data.status);
    } catch (err) {
      console.error(err);
      setKycStatus("error");
    }
  };

  /* ---------------- PROPERTIES ---------------- */
  const fetchProperties = async () => {
    try {
      const res = await api.get("/api/properties/my-properties");
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  useEffect(() => {
    if (kycStatus === "verified") {
      fetchProperties();
    }
  }, [kycStatus]);

  /* ---------------- FILTERING & SORTING LOGIC ---------------- */
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.address?.toLowerCase().includes(query) ||
          p.city?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    // Listing Type
    if (filters.listingType?.length > 0) {
      result = result.filter((p) => filters.listingType.includes(p.listingType));
    }

    // Location
    if (filters.location?.trim()) {
      const loc = filters.location.toLowerCase();
      result = result.filter(
        (p) =>
          p.address?.toLowerCase().includes(loc) ||
          p.city?.toLowerCase().includes(loc) ||
          p.area?.toLowerCase().includes(loc)
      );
    }

    // Price Range
    if (filters.minPrice > 0) {
      result = result.filter((p) => (p.price || 0) >= filters.minPrice);
    }
    if (filters.maxPrice < 10000000) {
      result = result.filter((p) => (p.price || 0) <= filters.maxPrice);
    }

    // Bedrooms
    if (filters.bedrooms && filters.bedrooms !== "any") {
      const bedCount = filters.bedrooms === "5+" ? 5 : parseInt(filters.bedrooms);
      result = result.filter((p) => {
        const pBed = parseInt(p.bedrooms) || 0;
        return filters.bedrooms === "5+" ? pBed >= bedCount : pBed === bedCount;
      });
    }

    // Bathrooms
    if (filters.bathrooms && filters.bathrooms !== "any") {
      const bathCount = filters.bathrooms === "4+" ? 4 : parseInt(filters.bathrooms);
      result = result.filter((p) => {
        const pBath = parseInt(p.bathrooms) || 0;
        return filters.bathrooms === "4+" ? pBath >= bathCount : pBath === bathCount;
      });
    }

    // Area Range
    if (filters.minArea) {
      result = result.filter((p) => (p.area || 0) >= parseFloat(filters.minArea));
    }
    if (filters.maxArea) {
      result = result.filter((p) => (p.area || 0) <= parseFloat(filters.maxArea));
    }

    // Property Type
    if (filters.propertyType?.length > 0) {
      result = result.filter((p) => filters.propertyType.includes(p.propertyType));
    }

    // Amenities (property must have ALL selected amenities)
    if (filters.amenities?.length > 0) {
      result = result.filter((p) => {
        const propertyAmenities = p.amenities || [];
        return filters.amenities.every((amenity) =>
          propertyAmenities.some(
            (pa) => pa.toLowerCase() === amenity.toLowerCase()
          )
        );
      });
    }

    // Status
    if (filters.status?.length > 0) {
      result = result.filter((p) => filters.status.includes(p.status));
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "area-large":
          return (b.area || 0) - (a.area || 0);
        case "area-small":
          return (a.area || 0) - (b.area || 0);
        case "title-az":
          return (a.title || "").localeCompare(b.title || "");
        case "title-za":
          return (b.title || "").localeCompare(a.title || "");
        default:
          return 0;
      }
    });

    return result;
  }, [properties, filters, searchQuery, sortBy]);

  /* ---------------- HANDLERS ---------------- */
  const handleAdd = () => {
    setEditingProperty(null);
    setOpenDialog(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.delete(`/api/properties/${id}`);
      fetchProperties();
    } catch (err) {
      console.error(err);
      alert("Failed to delete property");
    }
  };

  const handleDisable = async (id) => {
    try {
      await api.patch(`/api/properties/${id}/disable`);
      fetchProperties();
    } catch (err) {
      console.error(err);
      alert("Failed to update property status");
    }
  };

  const handlePropertySubmit = async () => {
    setOpenDialog(false);
    setEditingProperty(null);
    fetchProperties();
  };

  /* ---------------- RENDER ---------------- */
  if (kycStatus === "loading") {
    return (
      <div className="pt-5 p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking KYC status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
        <p className="text-gray-600">Manage and track your property listings</p>
      </div>

      {/* KYC Section */}
      {kycStatus !== "verified" && (
        <KycForm status={kycStatus} onSuccess={fetchKycStatus} />
      )}

      {/* Main Content */}
      {kycStatus === "verified" && (
        <>
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search properties by title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 lg:flex-none px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="area-large">Area: Largest</option>
                  <option value="area-small">Area: Smallest</option>
                  <option value="title-az">Title: A-Z</option>
                  <option value="title-za">Title: Z-A</option>
                </select>

                {/* View Toggle */}
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    title="List View"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredAndSortedProperties.length}</span> of{" "}
                <span className="font-semibold">{properties.length}</span> properties
              </p>
              {(searchQuery || Object.values(filters).some(v => v && (Array.isArray(v) ? v.length > 0 : true))) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>

          {/* Properties Grid/List */}
          {filteredAndSortedProperties.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredAndSortedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(property.id)}
                  onDisable={() => handleDisable(property.id)}
                  viewMode={viewMode}
                />
              ))}
              {viewMode === "grid" && <AddPropertyCard onClick={handleAdd} />}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
              <SlidersHorizontal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No properties found
              </h3>
              <p className="text-gray-500 mb-6">
                {properties.length === 0
                  ? "You haven't added any properties yet"
                  : "Try adjusting your filters or search query"}
              </p>
              {properties.length === 0 ? (
                <button
                  onClick={handleAdd}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Add Your First Property
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          {/* Add Property Button for List View */}
          {viewMode === "list" && filteredAndSortedProperties.length > 0 && (
            <button
              onClick={handleAdd}
              className="mt-6 w-full border-2 border-dashed border-gray-300 rounded-lg py-8 hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 hover:text-blue-500 font-medium"
            >
              + Add New Property
            </button>
          )}

          {/* Floating Action Button (Mobile) */}
          <button
            onClick={handleAdd}
            className="fixed bottom-6 right-6 lg:hidden bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-30 transition transform hover:scale-110"
            title="Add Property"
          >
            +
          </button>

          {/* Dialog */}
          <AddPropertyDialog
            isOpen={openDialog}
            property={editingProperty}
            onClose={() => {
              setOpenDialog(false);
              setEditingProperty(null);
            }}
            onSubmit={handlePropertySubmit}
          />
        </>
      )}
    </div>
  );
}
import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import KycForm from "../components/Kyc/kycForm";
import PropertyCard from "../components/property/PropertyCard";
import AddPropertyCard from "../components/property/AddPropertyCard";
import { AddPropertyDialog } from "../components/property/AddPropertyDialog";
import { Search, SlidersHorizontal, Grid, List } from "lucide-react";

export default function MyProperties({ filters = {} }) {
  const [kycStatus, setKycStatus] = useState("loading");
  const [properties, setProperties] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------- KYC ---------------- */
  const fetchKycStatus = async () => {
    try {
      const res = await api.get("/api/kyc/status");
      setKycStatus(res.data.status);
    } catch (err) {
      console.error(err);
      setKycStatus("error");
    }
  };

  /* ---------------- PROPERTIES ---------------- */
  const fetchProperties = async () => {
    try {
      const res = await api.get("/api/properties/my-properties");
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  useEffect(() => {
    if (kycStatus === "verified") {
      fetchProperties();
    }
  }, [kycStatus]);

  /* ---------------- FILTERING & SORTING LOGIC ---------------- */
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.address?.toLowerCase().includes(query) ||
          p.city?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    // Listing Type
    if (filters.listingType?.length > 0) {
      result = result.filter((p) => filters.listingType.includes(p.listingType));
    }

    // Location
    if (filters.location?.trim()) {
      const loc = filters.location.toLowerCase();
      result = result.filter(
        (p) =>
          p.address?.toLowerCase().includes(loc) ||
          p.city?.toLowerCase().includes(loc) ||
          p.area?.toLowerCase().includes(loc)
      );
    }

    // Price Range
    if (filters.minPrice > 0) {
      result = result.filter((p) => (p.price || 0) >= filters.minPrice);
    }
    if (filters.maxPrice < 10000000) {
      result = result.filter((p) => (p.price || 0) <= filters.maxPrice);
    }

    // Bedrooms
    if (filters.bedrooms && filters.bedrooms !== "any") {
      const bedCount = filters.bedrooms === "5+" ? 5 : parseInt(filters.bedrooms);
      result = result.filter((p) => {
        const pBed = parseInt(p.bedrooms) || 0;
        return filters.bedrooms === "5+" ? pBed >= bedCount : pBed === bedCount;
      });
    }

    // Bathrooms
    if (filters.bathrooms && filters.bathrooms !== "any") {
      const bathCount = filters.bathrooms === "4+" ? 4 : parseInt(filters.bathrooms);
      result = result.filter((p) => {
        const pBath = parseInt(p.bathrooms) || 0;
        return filters.bathrooms === "4+" ? pBath >= bathCount : pBath === bathCount;
      });
    }

    // Area Range
    if (filters.minArea) {
      result = result.filter((p) => (p.area || 0) >= parseFloat(filters.minArea));
    }
    if (filters.maxArea) {
      result = result.filter((p) => (p.area || 0) <= parseFloat(filters.maxArea));
    }

    // Property Type
    if (filters.propertyType?.length > 0) {
      result = result.filter((p) => filters.propertyType.includes(p.propertyType));
    }

    // Amenities (property must have ALL selected amenities)
    if (filters.amenities?.length > 0) {
      result = result.filter((p) => {
        const propertyAmenities = p.amenities || [];
        return filters.amenities.every((amenity) =>
          propertyAmenities.some(
            (pa) => pa.toLowerCase() === amenity.toLowerCase()
          )
        );
      });
    }

    // Status
    if (filters.status?.length > 0) {
      result = result.filter((p) => filters.status.includes(p.status));
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "area-large":
          return (b.area || 0) - (a.area || 0);
        case "area-small":
          return (a.area || 0) - (b.area || 0);
        case "title-az":
          return (a.title || "").localeCompare(b.title || "");
        case "title-za":
          return (b.title || "").localeCompare(a.title || "");
        default:
          return 0;
      }
    });

    return result;
  }, [properties, filters, searchQuery, sortBy]);

  /* ---------------- HANDLERS ---------------- */
  const handleAdd = () => {
    setEditingProperty(null);
    setOpenDialog(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.delete(`/api/properties/${id}`);
      fetchProperties();
    } catch (err) {
      console.error(err);
      alert("Failed to delete property");
    }
  };

  const handleDisable = async (id) => {
    try {
      await api.patch(`/api/properties/${id}/disable`);
      fetchProperties();
    } catch (err) {
      console.error(err);
      alert("Failed to update property status");
    }
  };

  const handlePropertySubmit = async () => {
    setOpenDialog(false);
    setEditingProperty(null);
    fetchProperties();
  };

  /* ---------------- RENDER ---------------- */
  if (kycStatus === "loading") {
    return (
      <div className="pt-5 p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking KYC status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
        <p className="text-gray-600">Manage and track your property listings</p>
      </div>

      {/* KYC Section */}
      {kycStatus !== "verified" && (
        <KycForm status={kycStatus} onSuccess={fetchKycStatus} />
      )}

      {/* Main Content */}
      {kycStatus === "verified" && (
        <>
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search properties by title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 lg:flex-none px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="area-large">Area: Largest</option>
                  <option value="area-small">Area: Smallest</option>
                  <option value="title-az">Title: A-Z</option>
                  <option value="title-za">Title: Z-A</option>
                </select>

                {/* View Toggle */}
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    title="List View"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredAndSortedProperties.length}</span> of{" "}
                <span className="font-semibold">{properties.length}</span> properties
              </p>
              {(searchQuery || Object.values(filters).some(v => v && (Array.isArray(v) ? v.length > 0 : true))) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>

          {/* Properties Grid/List */}
          {filteredAndSortedProperties.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredAndSortedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(property.id)}
                  onDisable={() => handleDisable(property.id)}
                  viewMode={viewMode}
                />
              ))}
              {viewMode === "grid" && <AddPropertyCard onClick={handleAdd} />}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
              <SlidersHorizontal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No properties found
              </h3>
              <p className="text-gray-500 mb-6">
                {properties.length === 0
                  ? "You haven't added any properties yet"
                  : "Try adjusting your filters or search query"}
              </p>
              {properties.length === 0 ? (
                <button
                  onClick={handleAdd}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Add Your First Property
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          {/* Add Property Button for List View */}
          {viewMode === "list" && filteredAndSortedProperties.length > 0 && (
            <button
              onClick={handleAdd}
              className="mt-6 w-full border-2 border-dashed border-gray-300 rounded-lg py-8 hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 hover:text-blue-500 font-medium"
            >
              + Add New Property
            </button>
          )}

          {/* Floating Action Button (Mobile) */}
          <button
            onClick={handleAdd}
            className="fixed bottom-6 right-6 lg:hidden bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-30 transition transform hover:scale-110"
            title="Add Property"
          >
            +
          </button>

          {/* Dialog */}
          <AddPropertyDialog
            isOpen={openDialog}
            property={editingProperty}
            onClose={() => {
              setOpenDialog(false);
              setEditingProperty(null);
            }}
            onSubmit={handlePropertySubmit}
          />
        </>
      )}
    </div>
  );
}