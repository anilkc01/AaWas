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
  Calendar,
  Gavel,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function PropertyDetailCard({ propertyId, onClose }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidLoading, setBidLoading] = useState(false);

  const [bidError, setBidError] = useState("");

  const [appointmentLoading, setAppointmentLoading] = useState(false);

  const navigate = useNavigate();

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

  const fetchBids = async () => {
    try {
      setBidsLoading(true);
      const res = await api.get(`/api/bookings/bids/${propertyId}`);
      setBids(res.data);
    } catch (error) {
      console.error("Failed to load bids", error);
      toast.error("Failed to Fetch Bids");
    } finally {
      setBidsLoading(false);
    }
  };

  const ensureKycVerified = async () => {
  try {
    const res = await api.get("/api/kyc/status");

    if (res.data.status !== "verified") {

      toast.info("Please complete KYC to place bids");
      navigate("/kyc");
      return false;
    }

    return true;
  } catch (err) {
    console.error(err);
    navigate("/kyc");
    return false;
  }
};

const handleOpenBidding = async () => {
  const allowed = await ensureKycVerified();
  if (!allowed) return;

  setShowBiddingModal(true);
  await fetchBids(); 
};



  const handlePlaceBid = async () => {
    const bidValue = parseFloat(bidAmount);
    setBidError("");

    // Basic validation
    if (!bidAmount || isNaN(bidValue) || bidValue <= 0) {
      setBidError("Please enter a valid bid amount");
      return;
    }

    const minBid = property.price;
    const highestBid = bids.length > 0 ? parseFloat(bids[0].bidAmount) : 0;

    if (bids.length === 0 && bidValue < minBid) {
      setBidError(`Minimum bid is ₨ ${Number(minBid).toLocaleString()}`);
      return;
    }

    if (bids.length > 0 && bidValue <= highestBid) {
      setBidError(
        `Bid must be higher than ₨ ${Number(highestBid).toLocaleString()}`
      );
      return;
    }

    try {
      setBidLoading(true);

      await api.post(`/api/bookings/bid/${propertyId}`, {
        bidAmount: bidValue,
      });

      toast.success("Bid placed successfully");
      setBidAmount("");
      setBidError("");
      await fetchBids();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place bid");
    } finally {
      setBidLoading(false);
    }
  };

const handleAppointmentSubmit = async ({ action }) => {
  try {
    setAppointmentLoading(true);

    let response;

    if (action === "book") {
      response = await api.post(
        `/api/bookings/appointment/${propertyId}`
      );
    }

    if (action === "cancel") {
      response = await api.delete(
        `/api/bookings/appointment/${propertyId}`
      );
    }

   
    toast.success(response.data.message);

    
    setProperty((prev) => ({
      ...prev,
      hasAppointment: action === "book" ? true : false,
    }));
  } catch (error) {
    console.error("Appointment action failed:", error);

    toast.error(
      error.response?.data?.message ||
        "Something went wrong. Please try again."
    );
  } finally {
    setAppointmentLoading(false);
  }
};


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

          {/* CTA Buttons */}
          <div className="space-y-3">
            {property.isBidding ? (
              <button
                onClick={handleOpenBidding}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold shadow-md transition flex items-center justify-center gap-2"
              >
                <Gavel size={18} />
                See Current Biddings
              </button>
            ) : property.hasAppointment ? (
              <div className="space-y-2">
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                  Owner has been notified and will contact you soon.
                </div>

                <button
                  onClick={() => handleAppointmentSubmit({ action: "cancel" })}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
                >
                  Cancel Appointment
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAppointmentSubmit({ action: "book" })}
                disabled={appointmentLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar size={18} />
                {appointmentLoading
                  ? "Booking..."
                  : "Book Appointment for Inspection"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Report this property
            </h2>

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

      {/* Bidding Modal */}
      {showBiddingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Current Biddings
              </h2>
              <button
                onClick={() => setShowBiddingModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Bids List */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-60 border rounded-lg p-3 bg-gray-50">
              {bidsLoading ? (
                <div className="text-center text-sm text-gray-500 py-4">
                  Loading bids...
                </div>
              ) : bids.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-4">
                  No bids yet. Be the first to bid!
                </div>
              ) : (
                bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex justify-between items-center bg-white p-3 rounded-lg border"
                  >
                    <div>
                      <div className="font-semibold text-sm text-gray-900">
                        {bid.User.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(bid.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        NPR {Number(bid.bidAmount).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Place Bid Section */}
            <div className="space-y-3 pt-3 border-t">
              <h3 className="text-sm font-semibold text-gray-900">
                Place Your Bid
              </h3>

              {/* Bid requirement info */}
              <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                {bids.length === 0 ? (
                  <span>
                    Minimum bid: NPR{" "}
                    <strong>{Number(property.price).toLocaleString()}</strong>
                  </span>
                ) : (
                  <span>
                    Bid must be higher than: NPR{" "}
                    <strong>
                      {Number(bids[0].bidAmount).toLocaleString()}
                    </strong>
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => {
                    setBidAmount(e.target.value);
                    setBidError("");
                  }}
                  placeholder="Enter bid amount"
                  className={`flex-1 border rounded-lg px-3 py-2 text-sm ${
                    bidError ? "border-red-500" : ""
                  }`}
                />

                <button
                  onClick={handlePlaceBid}
                  disabled={bidLoading || !bidAmount}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {bidLoading ? "Placing..." : "Place Bid"}
                </button>
              </div>

              {bidError && (
                <p className="text-xs text-red-600 mt-1">{bidError}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
