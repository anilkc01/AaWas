import { useState, useEffect } from "react";
import api from "../../../api/axios";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  ChefHat,
  Sofa,
  Home,
  DollarSign,
} from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function PropertyDetailCard({ propertyId, onClose }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!propertyId) return;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/properties/browse/${propertyId}`);
        console.log("Fetched property:", res.data);
        setProperty(res.data);
      } catch (error) {
        console.error("Failed to load property", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (loading || !property) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg text-sm">
          Loading property...
        </div>
      </div>
    );
  }

  // Combine dpImage with additional images
  const allImages = [property.dpImage, ...(property.images || [])];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
        >
          <X size={20} />
        </button>

        {/* Image Section with Navigation */}
        <div className="relative bg-black flex items-center justify-center h-80">
          <img
            src={`${API_BASE}/${allImages[currentImageIndex]}`}
            className="max-h-full max-w-full object-contain"
            alt={`Property image ${currentImageIndex + 1}`}
          />

          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>

        {/* Property Details */}
        <div className="p-6 space-y-4">
          {/* Price and Type */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                NPR {property.price.toLocaleString()}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <span className="capitalize bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {property.propertyType}
                </span>
                <span className="capitalize bg-green-100 text-green-700 px-2 py-1 rounded">
                  For {property.listedFor}
                </span>
                {property.isBidding && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    Bidding
                  </span>
                )}
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                property.status === "available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {property.status}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-gray-700">
            <MapPin size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{property.location}</span>
          </div>

          {/* Owner Info */}
          {property.User && (
            <div className="flex items-center gap-3 mt-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition">
              <img
                src={
                  property.User.Kyc?.image
                    ? `${API_BASE}/${property.User.Kyc.image}`
                    : "/default-user.png"
                }
                alt="Owner"
                className="w-10 h-10 rounded-full object-cover border"
              />

                <span className="text-sm font-semibold text-gray-800">
                  {property.User.fullName}
                </span>
              
            </div>
          )}

          {/* Room Details */}
          <div className="grid grid-cols-4 gap-4 py-4 border-y">
            <div className="flex flex-col items-center gap-2">
              <Bed size={24} className="text-gray-600" />
              <span className="text-sm font-medium">{property.beds} Beds</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sofa size={24} className="text-gray-600" />
              <span className="text-sm font-medium">
                {property.living} Living
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ChefHat size={24} className="text-gray-600" />
              <span className="text-sm font-medium">
                {property.kitchen} Kitchen
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Bath size={24} className="text-gray-600" />
              <span className="text-sm font-medium">
                {property.washroom} Bath
              </span>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>
          )}

          {/* Contact Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition">
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
}
