import { useState } from "react";
import api from "../../api/axios";

export default function KycForm({ status, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    email: "",
    phone: "",
    idType: "citizenship",
  });

  const [documentImage, setDocumentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documentImage) {
      setError("Document image is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      data.append("documentImage", documentImage);

      await api.post("/api/kyc/submit", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("KYC submitted successfully");
      onSuccess(); // refresh status in parent
    } catch (err) {
      setError(err.response?.data?.message || "KYC submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-6 max-w-xl border rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">KYC Verification</h2>

      {/* STATUS MESSAGES */}
      {status === "pending" && (
        <p className="text-yellow-600 mb-3">
          ⏳ Your KYC is under review. Please wait for approval.
        </p>
      )}

      {status === "rejected" && (
        <p className="text-red-600 mb-3">
          ❌ Your KYC was rejected. Please resubmit.
        </p>
      )}

      {status === "not_submitted" && (
        <p className="text-gray-700 mb-3">
          ⚠️ Please complete KYC to list properties.
        </p>
      )}

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {/* SHOW FORM ONLY WHEN ALLOWED */}
      {(status === "not_submitted" || status === "rejected") && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <select
            name="idType"
            value={formData.idType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="citizenship">Citizenship</option>
            <option value="passport">Passport</option>
            <option value="license">Driving License</option>
          </select>

          <div>
            <label className="block mb-1 font-medium">
              Upload ID Document
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDocumentImage(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#B59353] text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit KYC"}
          </button>
        </form>
      )}
    </div>
  );
}
