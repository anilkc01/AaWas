function PropertyCard({ title, price, image, isSold }) {
  return (
    <div style={{ position: "relative", width: "250px", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
      
      {/* SOLD Badge */}
      {isSold && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "red",
            color: "white",
            padding: "5px 10px",
            fontWeight: "italic",
            borderRadius: "4px",
            zIndex: 1
          }}
        >
          SOLD
        </div>
      )}

      <img src={image} alt={title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />

      <div style={{ padding: "10px" }}>
        <h3>{title}</h3>
        <p>Price: {price}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <PropertyCard
        title="Luxury Apartment"
        price="Rs. 1,20,00,000"
        image="https://via.placeholder.com/300"
        isSold={true}
      />

      <PropertyCard
        title="Family House"
        price="Rs. 90,00,000"
        image="https://via.placeholder.com/300"
        isSold={false}
      />
    </div>
  );
}
