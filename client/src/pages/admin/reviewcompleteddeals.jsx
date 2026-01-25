import React, { useState } from "react";



const completedDealsList = [
  {
    id: 1,
    seeker: "Ramesh Karki",
    provider: "Tech Repair Nepal",
    service: "Laptop Repair",
    completedDate: "2026-01-05",
  },
  {
    id: 2,
    seeker: "Sita Rai",
    provider: "Clean Home Services",
    service: "House Cleaning",
    completedDate: "2026-01-08",
  },
  {
    id: 3,
    seeker: "Bikash Shrestha",
    provider: "Quick Plumbers",
    service: "Pipe Maintenance",
    completedDate: "2026-01-12",
  },
  {
    id: 4,
    seeker: "Anita Lama",
    provider: "AC Fix Center",
    service: "AC Servicing",
    completedDate: "2026-01-15",
  },
  {
  id: 5,
  seeker: "Prakash Adhikari",
  provider: "Smart Electricians",
  service: "Wiring Repair",
  completedDate: "2026-01-18",
},
{
  id: 6,
  seeker: "Nirmala Gurung",
  provider: "Healthy Hands Care",
  service: "Home Nursing",
  completedDate: "2026-01-20",
},
{
  id: 7,
  seeker: "Sanjay Thapa",
  provider: "Fast Internet Solutions",
  service: "Router Setup",
  completedDate: "2026-01-22",
},
{
  id: 8,
  seeker: "Pooja Bhandari",
  provider: "Perfect Painters",
  service: "Room Painting",
  completedDate: "2026-01-24",
},
{
  id: 9,
  seeker: "Amit Joshi",
  provider: "Bike Care Nepal",
  service: "Motorbike Servicing",
  completedDate: "2026-01-26",
},
{
  id: 10,
  seeker: "Sabina KC",
  provider: "Glow Beauty Studio",
  service: "Makeup Service",
  completedDate: "2026-01-28",
},
{
  id: 11,
  seeker: "Rohit Maharjan",
  provider: "Secure Lock Services",
  service: "Door Lock Replacement",
  completedDate: "2026-01-30",
},
{
  id: 12,
  seeker: "Kritika Shahi",
  provider: "Urban Movers",
  service: "House Shifting",
  completedDate: "2026-02-02",
},
{
  id: 13,
  seeker: "Deepak Pandey",
  provider: "PC Doctor Nepal",
  service: "Desktop Repair",
  completedDate: "2026-02-05",
},
{
  id: 14,
  seeker: "Manisha Poudel",
  provider: "Fresh Laundry",
  service: "Laundry Service",
  completedDate: "2026-02-07",
},


];

export default function ReviewCompletedDeals() {
  /* =========================================================
     STATES
     ========================================================= */
  const [reviews, setReviews] = useState({});
  const [activeDeal, setActiveDeal] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  /* =========================================================
     RESET FORM
     ========================================================= */
  const resetForm = () => {
    setRating(0);
    setHover(0);
    setComment("");
    setError("");
    setEditMode(false);
    setActiveDeal(null);
  };

  /* =========================================================
     SUBMIT REVIEW
     ========================================================= */
  const submitReview = (dealId) => {
    if (rating === 0 || comment.trim() === "") {
      setError("Rating and review are required.");
      return;
    }

    const newReview = {
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };

    setReviews({
      ...reviews,
      [dealId]: newReview,
    });

    resetForm();
  };

  /* =========================================================
     EDIT REVIEW
     ========================================================= */
  const editReview = (dealId) => {
    setActiveDeal(dealId);
    setRating(reviews[dealId].rating);
    setComment(reviews[dealId].comment);
    setEditMode(true);
  };

  /* =========================================================
     DELETE REVIEW
     ========================================================= */
  const deleteReview = (dealId) => {
    const updated = { ...reviews };
    delete updated[dealId];
    setReviews(updated);
  };

  /* =========================================================
     STAR COMPONENT
     ========================================================= */
  const Star = ({ index }) => (
    <span
      className={`text-2xl cursor-pointer ${
        index <= (hover || rating)
          ? "text-yellow-400"
          : "text-gray-300"
      }`}
      onClick={() => setRating(index)}
      onMouseEnter={() => setHover(index)}
      onMouseLeave={() => setHover(0)}
    >
      ★
    </span>
  );

  /* =========================================================
     MAIN UI
     ========================================================= */
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ================= HEADER ================= */}
      <h1 className="text-3xl font-bold text-center mb-10">
        Review Completed Deals
      </h1>

      {/* ================= DEALS LIST ================= */}
      <div className="space-y-6">
        {completedDealsList.map((deal) => (
          <div
            key={deal.id}
            className="bg-white shadow-md rounded-lg p-6 border"
          >
            {/* ================= DEAL INFO ================= */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-semibold">
                  Service:{" "}
                  <span className="font-normal">{deal.service}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Completed On: {deal.completedDate}
                </p>
              </div>

              <div>
                <p className="text-sm">
                  <span className="font-semibold">Seeker:</span>{" "}
                  {deal.seeker}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Provider:</span>{" "}
                  {deal.provider}
                </p>
              </div>
            </div>

            {/* ================= EXISTING REVIEW ================= */}
            {reviews[deal.id] && activeDeal !== deal.id && (
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <p className="text-yellow-500 text-lg">
                  {"★".repeat(reviews[deal.id].rating)}
                  {"☆".repeat(5 - reviews[deal.id].rating)}
                </p>
                <p className="mt-2 text-gray-700">
                  {reviews[deal.id].comment}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Reviewed on {reviews[deal.id].date}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => editReview(deal.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteReview(deal.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* ================= REVIEW BUTTON ================= */}
            {!reviews[deal.id] && activeDeal !== deal.id && (
              <button
                onClick={() => setActiveDeal(deal.id)}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Write Review
              </button>
            )}

            {/* ================= REVIEW FORM ================= */}
            {activeDeal === deal.id && (
              <div className="mt-6 bg-gray-100 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  {editMode ? "Edit Your Review" : "Write a Review"}
                </h3>

                {error && (
                  <p className="text-red-500 text-sm mb-2">{error}</p>
                )}

                {/* ================= STAR RATING ================= */}
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} index={i} />
                  ))}
                </div>

                {/* ================= COMMENT ================= */}
                <textarea
                  className="w-full border rounded p-2 focus:outline-none focus:ring"
                  rows="4"
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {/* ================= ACTION BUTTONS ================= */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => submitReview(deal.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {editMode ? "Update Review" : "Submit Review"}
                  </button>

                  <button
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ================= FOOTER NOTE ================= */}
      <div className="text-center text-sm text-gray-500 mt-10">
        © 2026 Review System — Completed Deals Module
      </div>
    </div>
  );
}
