import React, { useEffect, useMemo, useState } from "react";

/* =========================================================
   MOCK DATA
   ========================================================= */

const initialBidResults = [
  {
    id: 1,
    bidderName: "Ram Sharma",
    venue: "Indoor Futsal Arena",
    bidAmount: 4500,
    date: "2026-01-01",
    status: "Accepted",
  },
  {
    id: 2,
    bidderName: "Sita Karki",
    venue: "Badminton Hall A",
    bidAmount: 3800,
    date: "2026-01-02",
    status: "Pending",
  },
  {
    id: 3,
    bidderName: "Bikash Thapa",
    venue: "Cricket Net Zone",
    bidAmount: 5200,
    date: "2026-01-03",
    status: "Rejected",
  },
  {
    id: 4,
    bidderName: "Anil Shrestha",
    venue: "Basketball Court",
    bidAmount: 4100,
    date: "2026-01-04",
    status: "Accepted",
  },
  {
    id: 5,
    bidderName: "Pooja Rai",
    venue: "Table Tennis Room",
    bidAmount: 2500,
    date: "2026-01-05",
    status: "Pending",
  },
];

/* =========================================================
   SMALL REUSABLE COMPONENTS
   ========================================================= */

const SectionTitle = ({ text }) => (
  <h2 style={{ marginBottom: "15px", color: "#222" }}>{text}</h2>
);

const StatCard = ({ label, value }) => (
  <div
    style={{
      background: "#f5f5f5",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      minWidth: "150px",
    }}
  >
    <h3 style={{ margin: 0 }}>{value}</h3>
    <p style={{ margin: 0, color: "#555" }}>{label}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const color =
    status === "Accepted"
      ? "#2ecc71"
      : status === "Rejected"
      ? "#e74c3c"
      : "#f1c40f";

  return (
    <span
      style={{
        backgroundColor: color,
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "12px",
        fontSize: "12px",
      }}
    >
      {status}
    </span>
  );
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function BidResults() {
  /* ---------------- STATE ---------------- */

  const [bids, setBids] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("date-desc");

  /* ---------------- EFFECT ---------------- */

  useEffect(() => {
    setBids(initialBidResults);
  }, []);

  /* ---------------- FILTERING ---------------- */

  const filteredBids = useMemo(() => {
    return bids
      .filter((bid) => {
        if (statusFilter === "All") return true;
        return bid.status === statusFilter;
      })
      .filter((bid) =>
        bid.bidderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [bids, searchTerm, statusFilter]);

  /* ---------------- SORTING ---------------- */

  const sortedBids = useMemo(() => {
    const sorted = [...filteredBids];

    switch (sortOption) {
      case "price-asc":
        sorted.sort((a, b) => a.bidAmount - b.bidAmount);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.bidAmount - a.bidAmount);
        break;
      case "date-asc":
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      default:
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return sorted;
  }, [filteredBids, sortOption]);

  /* ---------------- STATISTICS ---------------- */

  const totalBids = bids.length;

  const acceptedBids = useMemo(
    () => bids.filter((b) => b.status === "Accepted").length,
    [bids]
  );

  const pendingBids = useMemo(
    () => bids.filter((b) => b.status === "Pending").length,
    [bids]
  );

  const rejectedBids = useMemo(
    () => bids.filter((b) => b.status === "Rejected").length,
    [bids]
  );

  const totalRevenue = useMemo(
    () =>
      bids
        .filter((b) => b.status === "Accepted")
        .reduce((sum, b) => sum + b.bidAmount, 0),
    [bids]
  );

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        background: "#fafafa",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <h1 style={{ marginBottom: "10px" }}>Bid Results</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        View and manage all bidding results for sports venues
      </p>

      {/* STATISTICS */}
      <SectionTitle text="Summary" />

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "40px",
        }}
      >
        <StatCard label="Total Bids" value={totalBids} />
        <StatCard label="Accepted" value={acceptedBids} />
        <StatCard label="Pending" value={pendingBids} />
        <StatCard label="Rejected" value={rejectedBids} />
        <StatCard label="Revenue (Rs)" value={totalRevenue} />
      </div>

      {/* CONTROLS */}
      <SectionTitle text="Filters & Search" />

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Search by bidder name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "220px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="All">All Status</option>
          <option value="Accepted">Accepted</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="price-desc">Price (High → Low)</option>
          <option value="price-asc">Price (Low → High)</option>
        </select>
      </div>

      {/* TABLE */}
      <SectionTitle text="Bid Result List" />

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Bidder</th>
              <th style={thStyle}>Venue</th>
              <th style={thStyle}>Amount (Rs)</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedBids.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No bids found
                </td>
              </tr>
            )}

            {sortedBids.map((bid, index) => (
              <tr key={bid.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{bid.bidderName}</td>
                <td style={tdStyle}>{bid.venue}</td>
                <td style={tdStyle}>{bid.bidAmount}</td>
                <td style={tdStyle}>{bid.date}</td>
                <td style={tdStyle}>
                  <StatusBadge status={bid.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: "40px", color: "#777", fontSize: "14px" }}>
        <p>
          © 2026 Sportify — Bid Management Module. All data shown is for demo
          purposes.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "12px",
};
