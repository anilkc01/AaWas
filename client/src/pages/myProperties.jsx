import { useEffect, useState } from "react";
import api from "../api/axios";
import KycForm from "../components/Kyc/kycForm";
// import PropertyList from "../components/Property/PropertyList";
// import AddProperty from "../components/Property/AddProperty";

export default function MyProperties() {
  const [kycStatus, setKycStatus] = useState("loading");

  const fetchKycStatus = async () => {
    try {
      const res = await api.get("/api/kyc/status");
      setKycStatus(res.data.status); // verified | pending | rejected | not_submitted
    } catch (err) {
      console.error(err);
      setKycStatus("error");
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  if (kycStatus === "loading") {
    return (
      <div className="pt-16 p-4">
        <p>Checking KYC status...</p>
      </div>
    );
  }

  return (
    <div className="pt-16 p-4">
      <h1 className="text-2xl font-bold mb-4">My Properties</h1>

      {/* ❌ KYC NOT VERIFIED */}
      {kycStatus !== "verified" && (
        <KycForm
          status={kycStatus}
          onSuccess={fetchKycStatus}
        />
      )}

      {/* ✅ KYC VERIFIED */}
      {kycStatus === "verified" && (
        <>
          {/* <PropertyList /> */}
          {/* <AddProperty /> */}
          <p className="text-green-600 font-medium">
            ✅ KYC verified — you can manage your properties.
          </p>
        </>
      )}
    </div>
  );
}
