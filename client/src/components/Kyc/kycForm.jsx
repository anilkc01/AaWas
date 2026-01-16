import { useState } from "react";
import api from "../../api/axios";
import { KycSchema } from "./schema.kyc"

export default function KycForm({ status, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    email: "",
    phone: "",
    idType: "citizenship",
  });

  const [documentImage, setDocumentImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleDocumentImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentImage(file);
      setDocumentPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setError("");

    // ZOD FIELD VALIDATION
    const result = KycSchema.safeParse(formData);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      setError(firstError || "Invalid form data");
      return;
    }

    // FILE VALIDATION (kept exactly same logic)
    if (!profileImage) {
      setError("Profile image is required");
      return;
    }

    if (!documentImage) {
      setError("Document image is required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      data.append("documentImage", documentImage);
      data.append("image", profileImage);

      await api.post("/api/kyc/submit", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("KYC submitted successfully");
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "KYC submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-6">
      <div className="w-full max-w-sm p-5 border rounded-lg bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          KYC Verification
        </h2>

        {/* STATUS MESSAGES */}
        {status === "pending" && (
          <p className="text-yellow-600 mb-3 text-sm text-center">
            ⏳ Your KYC is under review.
          </p>
        )}

        {status === "rejected" && (
          <p className="text-red-600 mb-3 text-sm text-center">
            Your KYC was rejected. Please resubmit.
          </p>
        )}

        {status === "not_submitted" && (
          <p className="text-gray-700 mb-3 text-sm text-center">
            Please Complete KYC to list your properties.
          </p>
        )}

        {error && (
          <p className="text-red-600 mb-3 text-sm text-center">{error}</p>
        )}

        {/* SHOW FORM ONLY WHEN ALLOWED */}
        {(status === "not_submitted" || status === "rejected") && (
          <div className="space-y-3">
            {/* PROFILE IMAGE UPLOAD */}
            <div>
              <div
                onClick={() => document.getElementById("profileInput").click()}
                className="border-2 border-dashed border-gray-300 rounded-lg w-28 h-28 mx-auto flex items-center justify-center cursor-pointer hover:border-[#B59353] transition-colors"
              >
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <svg
                      className="mx-auto h-8 w-8 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-xs">Upload your Photo</p>
                  </div>
                )}
              </div>
              <input
                id="profileInput"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-[#B59353]"
            />

            <input
              type="text"
              name="address"
              placeholder="Address *"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-[#B59353]"
            />

            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-[#B59353]"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone *"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-[#B59353]"
            />

            <select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-[#B59353]"
            >
              <option value="citizenship">Citizenship</option>
              <option value="passport">Passport</option>
              <option value="license">Driving License</option>
            </select>

            {/* DOCUMENT IMAGE UPLOAD */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                ID Document *
              </label>
              <div
                onClick={() => document.getElementById("documentInput").click()}
                className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-[#B59353] transition-colors"
              >
                {documentPreview ? (
                  <img
                    src={documentPreview}
                    alt="Document"
                    className="h-full w-full object-contain rounded p-1"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <svg
                      className="mx-auto h-8 w-8 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-xs">Upload Document</p>
                  </div>
                )}
              </div>
              <input
                id="documentInput"
                type="file"
                accept="image/*"
                onChange={handleDocumentImageChange}
                className="hidden"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#B59353] text-white px-4 py-2 rounded w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A48343] transition-colors font-medium mt-2"
            >
              {loading ? "Submitting..." : "Submit KYC"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
