import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import PropertyCard from "../../components/property/Owner/MyPropertyCard";
import AddPropertyCard from "../../components/property/Owner/AddPropertyCard";
import { AddPropertyDialog } from "../../components/property/Owner/AddPropertyDialog";
import { BidsAndAppointments } from "../../components/property/Owner/bidsAndAppointments";
import { Bidders } from "../../components/property/Owner/Bidders";
import { Appointments } from "../../components/property/Owner/Appointments";

export default function MyProperties() {
  const navigate = useNavigate();

  const [kycStatus, setKycStatus] = useState("loading");
  const [properties, setProperties] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setShowDetails(true);
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#B59353] rounded-full animate-spin mb-4" />
        <p className="font-bold text-gray-500">Checking KYC status...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 w-full min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">
          My Properties
        </h1>

        {/* Improved Grid with Fixed Aspect Ratio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-stretch">
          {properties.map((property) => (
            <div key={property.id} onClick={() => handleCardClick(property)}>
              <PropertyCard
                property={property}
                onEdit={handleEdit}
                onDelete={(p) => handleDelete(p.id)}
                onDisable={(p) => handleDisable(p.id)}
                className="h-full w-full"
              />
            </div>
          ))}

          {/* AddPropertyCard wrapper forced to stretch height */}
          <div className="flex flex-col">
            <AddPropertyCard
              onClick={handleAdd}
              className="h-full w-full border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white hover:border-[#B59353] hover:bg-gray-50 transition-all group min-h-[280px]"
            />
          </div>
        </div>

        {selectedProperty?.isBidding ? (
          <Bidders
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            property={selectedProperty}
            refresh={fetchProperties}
          />
        ) : (
          <Appointments
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            property={selectedProperty}
            refresh={fetchProperties}
          />
        )}

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
    </div>
  );
}
