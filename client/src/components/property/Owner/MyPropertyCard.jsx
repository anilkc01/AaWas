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

  return (
    <div className="relative h-full  bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((p) => !p);
        }}
        className="absolute top-2 right-2 z-20 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100"
      >
        <MoreVertical size={16} />
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-9 right-2 z-30 w-36 bg-white border rounded-lg shadow text-[11px]"
          onMouseLeave={() => setMenuOpen(false)} 
        >
          <button
            onClick={() => onEdit(property)}
            className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-gray-100"
          >
            <Pencil size={12} /> Edit
          </button>

          <button
            onClick={() => onDisable(property)}
            className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-gray-100"
          >
            <EyeOff size={12} /> Mark Unavailable
          </button>

          <button
            onClick={() => onDelete(property)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}

      <img
        src={`${API_BASE}/${property.dpImage}`}
        className="h-40 w-full object-cover"
        alt="Property"
      />

      <div className="p-3 space-y-2">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-red-500" />
            {getShortLocation(property.location)}
          </div>
          <span className="text-sm font-semibold text-green-600">
            NPR {property.price.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-[11px] text-gray-700">
          <div className="flex items-center gap-1"><Bed size={13} />{property.beds}</div>
          <div className="flex items-center gap-1"><Sofa size={13} />{property.living}</div>
          <div className="flex items-center gap-1"><ChefHat size={13} />{property.kitchen}</div>
          <div className="flex items-center gap-1"><Bath size={13} />{property.washroom}</div>
        </div>
      </div>
    </div>
  );
}
