import React from "react";

const ViewSeekerRating = () => {
  // Dummy seeker data (later you can replace with API data)
  const seeker = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "+91 9876543210",
    joinedDate: "March 2024",
    totalBookings: 22,
    averageRating: 4.2,
    totalReviews: 18,
    ratingsBreakdown: {
      5: 10,
      4: 5,
      3: 2,
      2: 1,
      1: 0,
    },
    reviews: [
      {
        id: 1,
        reviewer: "Venue Owner A",
        rating: 5,
        comment: "Very polite and timely payment.",
      },
      {
        id: 2,
        reviewer: "Venue Owner B",
        rating: 4,
        comment: "Good communication, smooth booking.",
      },
      {
        id: 3,
        reviewer: "Venue Owner C",
        rating: 3,
        comment: "Late arrival but informed earlier.",
      },
    ],
  };

  return (
    <div style={styles.container}>
      {/* Seeker Basic Details */}
      <div style={styles.card}>
        <h2>Seeker Profile</h2>
        <p><strong>Name:</strong> {seeker.name}</p>
        <p><strong>Email:</strong> {seeker.email}</p>
        <p><strong>Phone:</strong> {seeker.phone}</p>
        <p><strong>Joined:</strong> {seeker.joinedDate}</p>
        <p><strong>Total Bookings:</strong> {seeker.totalBookings}</p>
      </div>

      {/* Rating Summary */}
      <div style={styles.card}>
        <h2>Rating Summary</h2>

        <h1 style={styles.rating}>
          {seeker.averageRating} ⭐
        </h1>
        <p>{seeker.totalReviews} total reviews</p>

        {/* Star Display */}
        <div style={styles.stars}>
          {[...Array(5)].map((_, index) => (
            <span key={index}>
              {index < Math.round(seeker.averageRating) ? "⭐" : "☆"}
            </span>
          ))}
        </div>
      </div>

      {/* Rating Breakdown */}
      <div style={styles.card}>
        <h2>Rating Breakdown</h2>

        {Object.keys(seeker.ratingsBreakdown)
          .reverse()
          .map((star) => (
            <div key={star} style={styles.breakdownRow}>
              <span>{star} ⭐</span>
              <progress
                value={seeker.ratingsBreakdown[star]}
                max={seeker.totalReviews}
                style={styles.progress}
              />
              <span>{seeker.ratingsBreakdown[star]}</span>
            </div>
          ))}
      </div>

      {/* Reviews Section */}
      <div style={styles.card}>
        <h2>Reviews</h2>

        {seeker.reviews.length === 0 ? (
          <p>No reviews available</p>
        ) : (
          seeker.reviews.map((review) => (
            <div key={review.id} style={styles.review}>
              <p><strong>{review.reviewer}</strong></p>
              <p>
                {[...Array(5)].map((_, index) => (
                  <span key={index}>
                    {index < review.rating ? "⭐" : "☆"}
                  </span>
                ))}
              </p>
              <p style={styles.comment}>{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "30px auto",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  rating: {
    fontSize: "36px",
    margin: "10px 0",
  },
  stars: {
    fontSize: "22px",
  },
  breakdownRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  progress: {
    flex: 1,
  },
  review: {
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  comment: {
    color: "#555",
  },
};

export default ViewSeekerRating;
