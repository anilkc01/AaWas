import { useEffect, useState } from "react";
import api from "../api/axios";
import KycForm from "../components/Kyc/kycForm";
import PropertyCard from "../components/property/PropertyCard";
import AddPropertyCard from "../components/property/AddPropertyCard";
import { AddPropertyDialog } from "../components/property/AddPropertyDialog";


export default function MyProperties() {
  const [kycStatus, setKycStatus] = useState("loading");
  const [properties, setProperties] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  const fetchKycStatus = async () => {
    try {
      const res = await api.get("/api/kyc/status");
      setKycStatus(res.data.status); // verified | pending | rejected | not_submitted
    } catch (err) {
      console.error(err);
      setKycStatus("error");
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await api.get("/api/properties/my-properties");
      console.log("Fetched properties:", res.data);
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  useEffect(() => {
    if (kycStatus === "verified") {
      fetchProperties();
    }
  }, [kycStatus]);

  const handlePropertySubmit = (data) => {
    console.log("Property submitted:", data);
    fetchProperties(); // Refresh the properties list
  };

  if (kycStatus === "loading") {
    return (
      <div className="pt-5 p-4">
        <p>Checking KYC status...</p>
      </div>
    );
  }

  return (
    <div className="pt-5 p-4">
      <h1 className="text-2xl font-bold mb-6">My Properties</h1>

      {/* KYC NOT VERIFIED */}
      {kycStatus !== "verified" && (
        <KycForm status={kycStatus} onSuccess={fetchKycStatus} />
      )}

      {/* KYC VERIFIED */}
      {kycStatus === "verified" && (
        <>
          {/* PROPERTIES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}

            {/* ADD PROPERTY TILE */}
            <AddPropertyCard onClick={() => setOpenAdd(true)} />
          </div>

          {/* ADD PROPERTY DIALOG */}
          <AddPropertyDialog
            isOpen={openAdd}
            onClose={() => setOpenAdd(false)}
            onSubmit={handlePropertySubmit}
          />
        </>
      )}
    </div>
  );
}