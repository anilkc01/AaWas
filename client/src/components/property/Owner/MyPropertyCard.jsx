import {
  MapPin,
  Bed,
  Bath,
  ChefHat,
  Sofa,
  MoreVertical,
  Pencil,
  EyeOff,
  Trash2
} from "lucide-react";
import { useState, useRef } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function PropertyCard({
  property,
  onEdit,
  onDelete,
  onDisable
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const getShortLocation = (location) =>
    location ? location.split(",")[0].trim() : "Unknown";

  const isFinalized = property.status === "sold" || property.status === "rented";

  return (
    <div className="relative h-full bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group border border-gray-100">
      
      {/* Red Status Tag */}
      {isFinalized && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-[#FF3112] text-white px-4 py-1.5 rounded-full shadow-lg">
            <span className="text-sm font-black tracking-tight capitalize">
              {property.status}
            </span>
          </div>
        </div>
      )}

      {/* Menu Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((p) => !p);
        }}
        className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
      >
        <MoreVertical size={16} className="text-gray-700" />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-11 right-3 z-30 w-40 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 text-xs font-bold"
          onMouseLeave={() => setMenuOpen(false)} 
        >
          <button
            onClick={() => onEdit(property)}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={14} className="text-gray-500" /> Edit Details
          </button>

          <button
            onClick={() => onDisable(property)}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <EyeOff size={14} className="text-gray-500" /> Mark Unavailable
          </button>

          <div className="h-[1px] bg-gray-100 my-1 mx-2" />

          <button
            onClick={() => onDelete(property)}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} /> Delete Property
          </button>
        </div>
      )}

      {/* Property Image */}
      <div className="h-44 w-full overflow-hidden">
        <img
          src={`${API_BASE}/${property.dpImage}`}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${isFinalized ? 'brightness-90' : ''}`}
          alt="Property"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5 text-gray-500">
            <MapPin size={16} className="text-red-500" />
            <span className="text-sm font-bold truncate max-w-[120px]">
                {getShortLocation(property.location)}
            </span>
          </div>
          <span className="text-sm font-black text-green-600">
            NPR {property.price.toLocaleString()}
          </span>
        </div>

        {/* Amenities Icons */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-gray-600">
          <div className="flex items-center gap-1.5 font-bold text-xs"><Bed size={15} /> {property.beds}</div>
          <div className="flex items-center gap-1.5 font-bold text-xs"><Sofa size={15} /> {property.living}</div>
          <div className="flex items-center gap-1.5 font-bold text-xs"><ChefHat size={15} /> {property.kitchen}</div>
          <div className="flex items-center gap-1.5 font-bold text-xs"><Bath size={15} /> {property.washroom}</div>
        </div>
      </div>
    </div>
  );
}