import { useState } from "react";

export default function RateReview() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0 || review.trim() === "") return;

    const newReview = {
      rating,
      review,
      date: new Date().toLocaleDateString(),
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setReview("");
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-lg font-semibold mb-2">Rate & Review Seeker</h2>

      {/* Rating */}
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer text-xl ${
              star <= rating ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          className="w-full border p-2 mb-2"
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded">
          Submit
        </button>
      </form>

      {/* Review List */}
      <div className="mt-4">
        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((item, index) => (
          <div key={index} className="border-t pt-2 mt-2">
            <p className="text-yellow-500">
              {"★".repeat(item.rating)}
            </p>
            <p>{item.review}</p>
            <small className="text-gray-500">{item.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
