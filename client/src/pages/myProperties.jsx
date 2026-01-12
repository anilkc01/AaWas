import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import PropertyCard from "../components/property/Owner/MyPropertyCard";
import AddPropertyCard from "../components/property/Owner/AddPropertyCard";
import { AddPropertyDialog } from "../components/property/Owner/AddPropertyDialog";

export default function MyProperties() {
  const navigate = useNavigate();

  const [kycStatus, setKycStatus] = useState("loading");
  const [properties, setProperties] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  /* ---------------- KYC ---------------- */
  const fetchKycStatus = async () => {
    try {
      const res = await api.get("/api/kyc/status");

      if (res.data.status !== "verified") {
        navigate("/kyc", { replace: true });
        return;
      }

      setKycStatus("verified");
    } catch (err) {
      console.error(err);
      navigate("/kyc", { replace: true });
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

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
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
    </div>
  );
}
