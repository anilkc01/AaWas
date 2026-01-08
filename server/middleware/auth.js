import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

 
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "email", "role", "status"],
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

   
    if (user.status === "suspended") {
      return res.status(403).json({
        error: "ACCOUNT_SUSPENDED",
        message: "Your account has been suspended. Please contact our office.",
      });
    }

    // Attach full trusted user
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

