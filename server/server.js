import express from "express";
import { connection } from "./Database/database.js";
import authRoutes from "./routes/authRoutes.js";
import kycRoutes from "./routes/kycRoutes.js";
import cors from "cors";

import 'dotenv/config';


const app = express();

app.use(cors({
  origin: "http://localhost:3000", // React dev server
}));

connection();

app.get("/", (req, res) => {
  res.send("Applicaiton is running");
});

app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);



app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
