import { useState, useEffect } from "react";
import { Star, User, Mail, Phone, MapPin, Calendar, Award } from "lucide-react";

export default function OwnerDetailsRatings({ ownerId }) {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOwnerDetails();
  }, [ownerId]);

  const fetchOwnerDetails = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`/api/owners/${ownerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch owner details");

      const data = await response.json();
      setOwnerData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  useEffect(() => {
    // Simulating API call with mock data
    setTimeout(() => {
      setOwnerData({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+977-9841234567",
        location: "Kathmandu, Nepal",
        joinedDate: "2023-05-15",
        totalProperties: 8,
        averageRating: 4.5,
        totalReviews: 24,
        ratings: {
          5: 15,
          4: 6,
          3: 2,
          2: 1,
          1: 0,
        },
        reviews: [
          {
            id: 1,
            renterName: "Sarah Miller",
            rating: 5,
            comment: "Excellent owner! Very responsive and professional.",
            date: "2024-12-20",
            propertyName: "Sunset Villa",
          },
          {
            id: 2,
            renterName: "Mike Johnson",
            rating: 4,
            comment: "Good experience overall. Quick to resolve issues.",
            date: "2024-11-15",
            propertyName: "Garden Apartment",
          },
          {
            id: 3,
            renterName: "Emily Chen",
            rating: 5,
            comment: "Very helpful and maintains the property well.",
            date: "2024-10-08",
            propertyName: "Mountain View House",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-[#B59353] text-[#B59353]" : "text-gray-300"}
      />
    ));
  };

  const calculatePercentage = (count, total) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B59353]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!ownerData) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-6 bg-gray-50 border rounded-lg">
        <p className="text-gray-600">Owner not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 mt-16">
      {/* Owner Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-[#B59353] flex items-center justify-center text-white text-3xl font-bold">
            {ownerData.name.charAt(0)}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {ownerData.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#B59353]" />
                <span>{ownerData.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#B59353]" />
                <span>{ownerData.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#B59353]" />
                <span>{ownerData.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#B59353]" />
                <span>Joined {new Date(ownerData.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-[#B59353]" />
                <span className="text-sm font-medium">
                  {ownerData.totalProperties} Properties
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ratings Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-[#B59353] mb-2">
              {ownerData.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(Math.round(ownerData.averageRating))}
            </div>
            <p className="text-gray-600 text-sm">
              Based on {ownerData.totalReviews} reviews
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{star} ★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#B59353] h-2 rounded-full transition-all"
                    style={{
                      width: `${calculatePercentage(
                        ownerData.ratings[star],
                        ownerData.totalReviews
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {ownerData.ratings[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Reviews</h2>

        <div className="space-y-4">
          {ownerData.reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
                      {review.renterName.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">
                      {review.renterName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-1">{review.comment}</p>
              <p className="text-xs text-gray-500">
                Property: {review.propertyName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Star, User, Mail, Phone, MapPin, Calendar, Award } from "lucide-react";

export default function OwnerDetailsRatings({ ownerId }) {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOwnerDetails();
  }, [ownerId]);

  const fetchOwnerDetails = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`/api/owners/${ownerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch owner details");

      const data = await response.json();
      setOwnerData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  useEffect(() => {
    // Simulating API call with mock data
    setTimeout(() => {
      setOwnerData({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+977-9841234567",
        location: "Kathmandu, Nepal",
        joinedDate: "2023-05-15",
        totalProperties: 8,
        averageRating: 4.5,
        totalReviews: 24,
        ratings: {
          5: 15,
          4: 6,
          3: 2,
          2: 1,
          1: 0,
        },
        reviews: [
          {
            id: 1,
            renterName: "Sarah Miller",
            rating: 5,
            comment: "Excellent owner! Very responsive and professional.",
            date: "2024-12-20",
            propertyName: "Sunset Villa",
          },
          {
            id: 2,
            renterName: "Mike Johnson",
            rating: 4,
            comment: "Good experience overall. Quick to resolve issues.",
            date: "2024-11-15",
            propertyName: "Garden Apartment",
          },
          {
            id: 3,
            renterName: "Emily Chen",
            rating: 5,
            comment: "Very helpful and maintains the property well.",
            date: "2024-10-08",
            propertyName: "Mountain View House",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-[#B59353] text-[#B59353]" : "text-gray-300"}
      />
    ));
  };

  const calculatePercentage = (count, total) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B59353]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!ownerData) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-6 bg-gray-50 border rounded-lg">
        <p className="text-gray-600">Owner not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 mt-16">
      {/* Owner Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-[#B59353] flex items-center justify-center text-white text-3xl font-bold">
            {ownerData.name.charAt(0)}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {ownerData.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#B59353]" />
                <span>{ownerData.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#B59353]" />
                <span>{ownerData.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#B59353]" />
                <span>{ownerData.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#B59353]" />
                <span>Joined {new Date(ownerData.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-[#B59353]" />
                <span className="text-sm font-medium">
                  {ownerData.totalProperties} Properties
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ratings Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-[#B59353] mb-2">
              {ownerData.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(Math.round(ownerData.averageRating))}
            </div>
            <p className="text-gray-600 text-sm">
              Based on {ownerData.totalReviews} reviews
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{star} ★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#B59353] h-2 rounded-full transition-all"
                    style={{
                      width: `${calculatePercentage(
                        ownerData.ratings[star],
                        ownerData.totalReviews
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {ownerData.ratings[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Reviews</h2>

        <div className="space-y-4">
          {ownerData.reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
                      {review.renterName.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">
                      {review.renterName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-1">{review.comment}</p>
              <p className="text-xs text-gray-500">
                Property: {review.propertyName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}






