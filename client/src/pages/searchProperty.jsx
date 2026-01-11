import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/navBars/NavBar1";
import LoginModal from "../components/AuthModals/LoginModal";
import RegisterModal from "../components/AuthModals/RegistrationModal";

// Property card component
const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img 
        src={property.image || "https://via.placeholder.com/400x300"} 
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{property.title}</h3>
          <span className="text-blue-600 font-bold">${property.price}/month</span>
        </div>
        <p className="text-gray-600 text-sm mb-3">{property.address}</p>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <span className="mr-4">{property.bedrooms} beds</span>
          <span className="mr-4">{property.bathrooms} baths</span>
          <span>{property.area} sq ft</span>
        </div>
        <p className="text-gray-700 text-sm line-clamp-2">{property.description}</p>
      </div>
    </div>
  );
};

// Search filters component
const SearchFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="Enter city or address"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <select
            value={filters.bedrooms}
            onChange={(e) => onFilterChange('bedrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="villa">Villa</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onFilterChange('reset', null)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
        >
          Reset Filters
        </button>
        <button
          onClick={() => onFilterChange('search', null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </div>
  );
};

// Main SearchProperty component
export default function SearchProperty({ onLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const showModal = isLogin || isRegister;

  // Initial filters state
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    propertyType: ""
  });

  // Mock data - replace with actual API call
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Modern Apartment in Downtown",
      price: 1500,
      address: "123 Main St, New York, NY",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      description: "Beautiful modern apartment with great amenities.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Luxury Villa with Pool",
      price: 3500,
      address: "456 Luxury Ln, Los Angeles, CA",
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      description: "Spacious villa with private pool and garden.",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w-400&h=300&fit=crop"
    },
    // Add more properties as needed
  ]);

  // Filter handler
  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        location: "",
        minPrice: "",
        maxPrice: "",
        bedrooms: "",
        propertyType: ""
      });
    } else if (key === 'search') {
      // Here you would typically make an API call with the filters
      console.log("Searching with filters:", filters);
      // For now, we'll just log it
      alert(`Searching properties with filters: ${JSON.stringify(filters)}`);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  // Handle property click
  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <div className={showModal ? "filter blur-sm pointer-events-none" : ""}>
        <Navbar />
        
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Find Your Dream Property
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the perfect property that matches your lifestyle and budget.
                Search through thousands of listings with detailed filters.
              </p>
            </div>

            {/* Search Filters */}
            <SearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />

            {/* Results Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Available Properties
                  <span className="text-gray-600 text-lg ml-2">
                    ({properties.length} found)
                  </span>
                </h2>
                <select className="px-3 py-2 border border-gray-300 rounded-md">
                  <option>Sort by: Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>

              {/* Property Grid */}
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <div 
                      key={property.id} 
                      onClick={() => handlePropertyClick(property.id)}
                      className="cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
                    >
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                  <button 
                    onClick={() => handleFilterChange('reset', null)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Featured Properties Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.slice(0, 3).map((property) => (
                  <div key={`featured-${property.id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800">{property.title}</h3>
                      <p className="text-blue-600 font-bold mt-2">${property.price}/month</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlays - same as your GuestPage */}
      {isLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20"></div>
          <LoginModal onLoginSuccess={onLoginSuccess} />
        </div>
      )}

      {isRegister && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20"></div>
          <RegisterModal />
        </div>
      )}
    </>
  );
}
