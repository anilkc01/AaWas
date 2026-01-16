import express from "express";
import { connection } from "./Database/database.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import kycRoutes from "./routes/kycRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();

app.use(cors({
  origin: "*", // React dev server
}));

connection();

app.get("/", (req, res) => {
  res.send("Applicaiton is running");
});

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/kyc", kycRoutes);

app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);


app.listen(5001,  "0.0.0.0", () => {
  console.log("Server is running on port 5001");
});
