import express from "express";
import { connection } from "./Database/db.js";
import { userRouter } from "./Routes/userRoute.js";
import { productRouter } from "./Routes/productRoute.js";
import { authRouter } from "./Routes/authRoute.js";
const app = express();

connection();

app.get("/", (req, res) => {
  res.send("Applicaiton is running");
});

app.use(express.json());

app.use("/api/users", userRouter);

app.use("/api/auth", authRouter);

app.use("/api/products", productRouter);


app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
