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
  Heart,
  Flag,
} from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function PropertyDetailCard({ propertyId, onClose }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) return;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/properties/browse/${propertyId}`);
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

  const handleFavourite = async () => {
    try {
      const res = await api.post(`/api/properties/favourite/${property.id}`);

      setProperty((prev) => ({
        ...prev,
        isFavourite: res.data.isFavourite,
      }));
    } catch (err) {
      alert("Failed to toggle favourite");
    }
  };

  const handleReportSubmit = async () => {
    try {
      setReportLoading(true);
      console.log(property.id);
      await api.post(`/api/properties/report/${property.id}`, {
        reason: reportReason,
        message: reportMessage,
      });

      alert("Report submitted. Thank you!");
      setShowReportModal(false);
      setReportReason("");
      setReportMessage("");
    } catch (err) {
      console.log(err);
      alert("Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-50"
        >
          <X size={20} />
        </button>

        {/* IMAGE SECTION */}
        <div className="relative bg-black h-80 flex items-center justify-center rounded-t-xl overflow-hidden">
          <img
            src={`${API_BASE}/${allImages[currentImageIndex]}`}
            className="max-h-full max-w-full object-contain"
            alt="Property"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={handleFavourite}
              className={`p-2 rounded-full shadow ${
                property.isFavourite
                  ? "bg-red-100 text-red-600"
                  : "bg-white text-gray-700"
              }`}
            >
              <Heart
                size={18}
                fill={property.isFavourite ? "currentColor" : "none"}
              />
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="bg-white/90 p-2 rounded-full shadow hover:bg-white"
            >
              <Flag size={18} />
            </button>
          </div>

          {/* Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>

        {/* DETAILS */}
        <div className="p-6 space-y-4">
          {/* Price + Status */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                NPR {Number(property.price).toLocaleString()}
              </h2>

              <div className="flex gap-2 mt-2 text-xs">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {property.propertyType}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  For {property.listedFor}
                </span>
                {property.isBidding && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                    Bidding
                  </span>
                )}
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                property.status === "available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {property.status}
            </span>
          </div>

          {/* Location */}
          <div className="flex gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-red-500 mt-0.5" />
            {property.location}
          </div>

          {/* Owner */}
          {property.User && (
            <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <img
                src={
                  property.User.Kyc?.image
                    ? `${API_BASE}/${property.User.Kyc.image}`
                    : "/default-user.png"
                }
                className="w-11 h-11 rounded-full object-cover border"
                alt="Owner"
              />
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {property.User.fullName}
                </div>
                <div className="text-xs text-gray-500">Verified Owner</div>
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="grid grid-cols-4 gap-4 py-4 border-y text-center text-xs">
            <div>
              <Bed className="mx-auto mb-1 text-gray-600" />
              {property.beds} Beds
            </div>
            <div>
              <Sofa className="mx-auto mb-1 text-gray-600" />
              {property.living} Living
            </div>
            <div>
              <ChefHat className="mx-auto mb-1 text-gray-600" />
              {property.kitchen} Kitchen
            </div>
            <div>
              <Bath className="mx-auto mb-1 text-gray-600" />
              {property.washroom} Bath
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>
          )}

          {/* CTA */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition">
            Contact Owner
          </button>
        </div>
      </div>
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Report this property
            </h2>

            {/* Reason */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Reason <span className="text-red-500">*</span>
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                required
              >
                <option value="">Select reason</option>
                <option value="fake_listing">Fake listing</option>
                <option value="scam">Scam</option>
                <option value="wrong_price">Wrong price</option>
                <option value="duplicate">Duplicate</option>
                <option value="offensive_content">Offensive content</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                rows={3}
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none"
                placeholder="Add more details (optional)"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                disabled={!reportReason || reportLoading}
                onClick={handleReportSubmit}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {reportLoading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
