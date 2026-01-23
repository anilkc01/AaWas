import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../Security/jwt-utils.js";
import OTP from "../models/OTP.js";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import { sendEmail } from "../Security/helpers.js";

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
        message: "Your account has been suspended. Please contact support."
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
  console.log("asdf");
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


export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password. Deletion cancelled." });

    await user.destroy();
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



export const changePassword = async (req, res) => {
  console.log("aayo");
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) return res.status(404).json({ message: "No email found" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.upsert({ userId: user.id, otp: otpCode, expiresAt: expiry });

   
    await sendEmail(
      email,
      "Password Reset OTP",
      `<p>Your OTP for password reset is: <b style="font-size: 20px; color: #B59353;">${otpCode}</b></p>
       <p>This code expires in 5 minutes.</p>`
    );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Could not Send OTP" });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "No email found" });

    // Find valid OTP record
    const otpRecord = await OTP.findOne({
      where: {
        userId: user.id,
        otp: otp,
        expiresAt: { [Op.gt]: new Date() }, 
      },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP Verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error during verification" });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "No email found" });

    
    const otpRecord = await OTP.findOne({
      where: {
        userId: user.id,
        otp: otp,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Session expired. Please request a new OTP." });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(password, 12);
    await user.update({ password: hashedPassword });

    
    await otpRecord.destroy();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not reset password" });
  }
};