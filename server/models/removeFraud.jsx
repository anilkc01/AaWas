import express from "express";

const app = express();
app.use(express.json());

// Fake in-memory data (NO DATABASE)
let listings = [
  { id: 1, title: "House for Sale", price: 50000, status: "active", fraudScore: 0 },
  { id: 2, title: "Cheap Land Deal", price: 5000, status: "active", fraudScore: 0 }
];

// Get listings
app.get("/listings", (req, res) => {
  res.json(listings);
});

// Report listing
app.post("/report/:id", (req, res) => {
  const id = Number(req.params.id);
  const listing = listings.find(item => item.id === id);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  listing.fraudScore += 1;

  if (listing.fraudScore >= 3) {
    listing.status = "flagged";
  }

  res.json({ message: "Listing reported", listing });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
