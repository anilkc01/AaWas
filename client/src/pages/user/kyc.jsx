// pages/KycPage.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";
import KycForm from "../../components/Kyc/kycForm";


export default function KycPage() {
  const [status, setStatus] = useState("loading");

  const fetchKycStatus = async () => {
    try {
      const res = await api.get("/api/kyc/status");
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  if (status === "loading") {
    return <p className="text-center mt-10">Checking KYC status...</p>;
  }

  if (status === "verified") {
    return (
      <p className="text-center mt-10 text-green-600">
        ✅ Your KYC is verified
      </p>
    );
  }

  return (
    <KycForm
      status={status}
      onSuccess={fetchKycStatus}
    />
  );
}
