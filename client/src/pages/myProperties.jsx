export default function MyProperties({ filters = {} }) {
  const [kycStatus, setKycStatus] = useState("loading");
  const [properties, setProperties] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  /* ... your existing fetch functions ... */

  // Add filtering logic
  const filteredProperties = properties.filter(property => {
    // If no filters are active, show all
    const hasActiveFilters = Object.values(filters).some(v => v);
    if (!hasActiveFilters) return true;

    // Check each filter
    if (filters.forSale && property.listingType !== 'sale') return false;
    if (filters.forRent && property.listingType !== 'rent') return false;
    if (filters.furnished && !property.furnished) return false;
    if (filters.parking && !property.parking) return false;
    
    return true;
  });

  /* ... rest of your code ... */

  return (
    <div className="pt-5 p-4">
      <h1 className="text-2xl font-bold mb-6">My Properties</h1>
      
      {kycStatus !== "verified" && (
        <KycForm status={kycStatus} onSuccess={fetchKycStatus} />
      )}
      
      {kycStatus === "verified" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
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

          {filteredProperties.length === 0 && properties.length > 0 && (
            <p className="text-center text-gray-500 mt-8">No properties match your filters</p>
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
        </>
      )}
    </div>
  );
}