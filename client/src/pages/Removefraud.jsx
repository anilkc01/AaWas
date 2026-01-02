import axios from "axios";

export default function ReportListing({ listingId }) {
  const handleReport = async () => {
    try {
      await axios.post(`http://localhost:5000/report/${listingId}`);
      alert("Listing reported successfully!");
    } catch (err) {
      alert("Error reporting listing");
    }
  };

  return (
    <button
      onClick={handleReport}
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "8px 12px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer"
      }}
    >
      🚩 Report Fraud
    </button>
  );
}
