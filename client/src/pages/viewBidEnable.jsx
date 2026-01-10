import React, { useMemo, useState } from "react";

/* =====================================================
   MOCK DATA – BIDDING ENABLED PROPERTIES
   ===================================================== */

const propertiesData = [
  {
    id: 1,
    name: "Elite Futsal Arena",
    sport: "Futsal",
    location: "Kathmandu",
    basePrice: 3000,
    highestBid: 4800,
    biddingEnabled: true,
    biddingEndDate: "2026-01-10",
  },
  {
    id: 2,
    name: "Pro Badminton Hall",
    sport: "Badminton",
    location: "Lalitpur",
    basePrice: 2000,
    highestBid: 3500,
    biddingEnabled: true,
    biddingEndDate: "2026-01-12",
  },
  {
    id: 3,
    name: "Cricket Practice Nets",
    sport: "Cricket",
    location: "Bhaktapur",
    basePrice: 4000,
    highestBid: 6000,
    biddingEnabled: true,
    biddingEndDate: "2026-01-08",
  },
  {
    id: 4,
    name: "Indoor Basketball Court",
    sport: "Basketball",
    location: "Pokhara",
    basePrice: 3500,
    highestBid: 5100,
    biddingEnabled: true,
    biddingEndDate: "2026-01-15",
  },
];

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

export default function ViewBiddingProperties() {
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");

  /* =====================================================
     FILTER LOGIC
     ===================================================== */

  const filteredProperties = useMemo(() => {
    return propertiesData
      .filter((property) => property.biddingEnabled)
      .filter((property) =>
        property.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((property) =>
        sportFilter === "All" ? true : property.sport === sportFilter
      );
  }, [search, sportFilter]);

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <h1 style={{ marginBottom: "10px" }}>
        Bidding Enabled Properties
      </h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        View all sports venues where bidding is currently active
      </p>

      {/* CONTROLS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="All">All Sports</option>
          <option value="Futsal">Futsal</option>
          <option value="Badminton">Badminton</option>
          <option value="Cricket">Cricket</option>
          <option value="Basketball">Basketball</option>
        </select>
      </div>

      {/* PROPERTY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "25px",
        }}
      >
        {filteredProperties.length === 0 && (
          <p>No bidding-enabled properties found.</p>
        )}

        {filteredProperties.map((property) => (
          <div key={property.id} style={cardStyle}>
            <h3 style={{ marginBottom: "8px" }}>{property.name}</h3>

            <p style={textMuted}>
              {property.sport} • {property.location}
            </p>

            <hr />

            <p>
              <strong>Base Price:</strong> Rs {property.basePrice}
            </p>

            <p>
              <strong>Highest Bid:</strong>{" "}
              <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                Rs {property.highestBid}
              </span>
            </p>

            <p>
              <strong>Bidding Ends:</strong> {property.biddingEndDate}
            </p>

            <button
              style={buttonStyle}
              onClick={() =>
                alert(`View bids for ${property.name}`)
              }
            >
              View Bids
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

const inputStyle = {
  padding: "10px",
  minWidth: "220px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const buttonStyle = {
  marginTop: "15px",
  padding: "10px",
  width: "100%",
  backgroundColor: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const textMuted = {
  color: "#777",
  fontSize: "14px",
};
