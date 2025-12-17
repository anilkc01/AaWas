export default function PropertyCard({ property }) {

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <img
        src={`http://localhost:5001/${property.dpImage}`}
        alt="Property"
        className="h-48 w-full object-cover"
      />
      <div className="p-3">
        <p className="text-sm text-gray-600">
          📍 {property.location}
        </p>
        <div className="flex gap-4 text-xs mt-2 text-gray-700">
          <span>{property.beds} bed</span>
          <span>{property.living} living</span>
          <span>{property.kitchen} kitchen</span>
        </div>
        <p className="font-semibold text-right mt-2">
          NPR {property.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}