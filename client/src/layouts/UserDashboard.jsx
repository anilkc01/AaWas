import { useState } from "react";
import Navbar from "../components/navBars/NavBar2.jsx";
import BrowseProperties from "../pages/browseProperties.jsx";
import MyProperties from "../pages/myProperties.jsx";

export default function DashboardPage({ onLogout }) {
  const [view, setView] = useState("browse");
  const [filters, setFilters] = useState({
    forSale: false,
    forRent: false,
    furnished: false,
    parking: false,
  });

  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <>
      <Navbar
        onLogout={onLogout}
        view={view}
        setView={setView}
      />
      <div className="pt-14 px-6">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="font-semibold mb-3">Filters</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.forSale}
                onChange={() => handleFilterChange('forSale')}
                className="w-4 h-4 accent-blue-500"
              />
              <span>For Sale</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.forRent}
                onChange={() => handleFilterChange('forRent')}
                className="w-4 h-4 accent-blue-500"
              />
              <span>For Rent</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.furnished}
                onChange={() => handleFilterChange('furnished')}
                className="w-4 h-4 accent-blue-500"
              />
              <span>Furnished</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.parking}
                onChange={() => handleFilterChange('parking')}
                className="w-4 h-4 accent-blue-500"
              />
              <span>Parking</span>
            </label>
          </div>
        </div>

        {/* Properties Display */}
        {view === "my" ? (
          <MyProperties filters={filters} />
        ) : (
          <BrowseProperties filters={filters} />
        )}
      </div>
    </>
  );
}