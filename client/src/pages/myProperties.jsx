import { useEffect, useState } from "react";
import api from "../api/axios";

import KycForm from "../components/Kyc/kycForm";
import PropertyCard from "../components/property/PropertyCard";
import AddPropertyCard from "../components/property/AddPropertyCard";
import { AddPropertyDialog } from "../components/property/AddPropertyDialog";

export default function MyProperties() {
  const [kycStatus, setKycStatus] = useState("loading");
  const [properties, setProperties] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  /* ---------------- KYC ---------------- */
  const fetchKycStatus = async () => {
    try {
      const res = await api.get("/api/kyc/status");
      setKycStatus(res.data.status);
    } catch (err) {
      console.error(err);
      setKycStatus("error");
    }
  };

  /* ---------------- PROPERTIES ---------------- */
  const fetchProperties = async () => {
    try {
      const res = await api.get("/api/properties/my-properties");
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

  /* ---------------- HANDLERS ---------------- */

  const handleAdd = () => {
    setEditingProperty(null);
    setOpenDialog(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await api.delete(`/api/properties/${id}`);
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisable = async (id) => {
    try {
      await api.patch(`/api/properties/${id}/disable`);
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePropertySubmit = async () => {
    setOpenDialog(false);
    setEditingProperty(null);
    fetchProperties();
  };

  /* ---------------- RENDER ---------------- */

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

      {kycStatus !== "verified" && (
        <KycForm status={kycStatus} onSuccess={fetchKycStatus} />
      )}

      {kycStatus === "verified" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEdit}
                onDelete={(p) => handleDelete(p.id)}
                onDisable={(p) => handleDisable(p.id)}
              />
            ))}

            <AddPropertyCard onClick={handleAdd} />
          </div>

          <AddPropertyDialog
            isOpen={openDialog}
            property={editingProperty}
            onClose={() => {
              setOpenDialog(false);
              setEditingProperty(null);
            }}
            onSubmit={handlePropertySubmit}
          />
        </>
      )}
    </div>
  );
}
