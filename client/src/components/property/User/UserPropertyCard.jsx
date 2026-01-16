import { MapPin, Bed, Bath, ChefHat, Sofa } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function UserPropertyCard({ property, onClick }) {
  const getShortLocation = (location) =>
    location ? location.split(",")[0].trim() : "Unknown";

  return (
    <div 
      onClick={() => onClick(property)}
      className="relative bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer"
    >
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
          <div className="flex items-center gap-1">
            <Bed size={13} />
            {property.beds}
          </div>
          <div className="flex items-center gap-1">
            <Sofa size={13} />
            {property.living}
          </div>
          <div className="flex items-center gap-1">
            <ChefHat size={13} />
            {property.kitchen}
          </div>
          <div className="flex items-center gap-1">
            <Bath size={13} />
            {property.washroom}
          </div>
        </div>
      </div>
    </div>
  );
}