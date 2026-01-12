import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../Security/jwt-utils.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, rePassword } = req.body;

    let errors = {};

    // Required fields
    if (!fullName) errors.fullName = "Full name is required.";
    if (!email) errors.email = "Email is required.";
    if (!phone) errors.phone = "Phone number is required.";
    if (!password) errors.password = "Password is required.";
    if (!rePassword) errors.rePassword = "Please re-enter password.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Password match
    if (password !== rePassword) {
      return res.status(400).json({
        errors: {
          rePassword: "Passwords do not match.",
        },
      });
    }

    // Existing email
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        errors: {
          email: "Email already registered.",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errors: {
        general: "Server error. Please try again.",
      },
    });
  }
};

export const loginUser = async (req, res) => {
  console.log("Login attempt received");
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        error: "EMAIL_NOT_FOUND",
        message: "User doesnot exist"
      });
    }

    //  ACCOUNT SUSPENDED CHECK
    if (user.status === "suspended") {
      return res.status(403).json({
        error: "ACCOUNT_SUSPENDED",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "INVALID_PASSWORD",
        message: "Invalid Password"
      });
    }

    const token = generateToken({ id: user.id }, remember);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const verifyToken = (req, res) => {
  res.status(200).json({
    valid: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,      
      status: req.user.status, 
    },
  });
};

