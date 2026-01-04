import { useState } from "react";

export default function Rate() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0 || review.trim() === "") {
      setError("Please provide both rating and review.");
      return;
    }

    const reviewData = {
      rating,
      review,
      createdAt: new Date().toISOString(),
      reviewerType: "Seeker",
    };

    console.log("Submitted Review:", reviewData);

    setSubmitted(true);
    setError("");
    setRating(0);
    setReview("");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>Rate & Review</h2>

      {submitted && <p style={{ color: "green" }}>Thank you for your feedback!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div style={{ display: "flex", marginBottom: "10px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                fontSize: "30px",
                cursor: "pointer",
                color: star <= (hover || rating) ? "#ffc107" : "#e4e5e9",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <p>Selected Rating: {rating || "None"}</p>

        {/* Review Text */}
        <textarea
          placeholder="Write your experience as a seeker..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="5"
          style={{ width: "100%", marginBottom: "10px" }}
        />

        {/* Submit Button */}
        <button type="submit">
          Submit Review
        </button>
      </form>
    </div>
  );
}
