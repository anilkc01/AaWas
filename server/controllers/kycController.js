import fs from "fs";
import path from "path";
import Kyc from "../models/Kyc.js";

/**
 * Ensure user KYC directory exists
 */
const ensureUserKycDir = (userId) => {
  const dir = `uploads/kyc/${userId}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

/**
 * Move file to user-specific KYC folder
 */
const moveToUserKycFolder = (oldPath, userId, filename) => {
  const userDir = ensureUserKycDir(userId);
  const newPath = path.join(userDir, filename);
  fs.renameSync(oldPath, newPath);
  return newPath;
};

/**
 * Delete old KYC files
 */
const deleteOldKycFiles = (kyc) => {
  if (kyc.image && fs.existsSync(kyc.image)) {
    fs.unlinkSync(kyc.image);
  }
  if (kyc.documentImage && fs.existsSync(kyc.documentImage)) {
    fs.unlinkSync(kyc.documentImage);
  }
};

/**
 * SUBMIT KYC
 */
export const submitKyc = async (req, res) => {
  try {
    const { fullName, address, email, phone, idType } = req.body;

    // Validate required files
    if (!req.files?.image?.[0]) {
      return res.status(400).json({ message: "Profile image is required" });
    }
    if (!req.files?.documentImage?.[0]) {
      return res.status(400).json({ message: "Document image is required" });
    }

    const existingKyc = await Kyc.findOne({
      where: { userId: req.user.id },
    });

    // Check if KYC already submitted and not rejected
    if (existingKyc && existingKyc.status !== "rejected") {
      return res.status(400).json({
        message: "KYC already submitted and under review",
      });
    }

    const userId = req.user.id;

    // Move files to user-specific folder
    const profileImageFilename = `profile-${Date.now()}${path.extname(
      req.files.image[0].originalname
    )}`;
    const documentImageFilename = `document-${Date.now()}${path.extname(
      req.files.documentImage[0].originalname
    )}`;

    const newProfilePath = moveToUserKycFolder(
      req.files.image[0].path,
      userId,
      profileImageFilename
    );

    const newDocumentPath = moveToUserKycFolder(
      req.files.documentImage[0].path,
      userId,
      documentImageFilename
    );

    // Re-submit after rejection
    if (existingKyc && existingKyc.status === "rejected") {
      // Delete old files
      deleteOldKycFiles(existingKyc);

      // Update KYC record
      await existingKyc.update({
        fullName,
        address,
        email,
        phone,
        idType,
        documentImage: newDocumentPath,
        image: newProfilePath,
        status: "pending",
      });

      return res.json({
        message: "KYC resubmitted successfully",
      });
    }

    // New submission - Create KYC record
    await Kyc.create({
      userId: req.user.id,
      fullName,
      address,
      email,
      phone,
      idType,
      documentImage: newDocumentPath,
      image: newProfilePath,
      status: "pending",
    });

    res.status(201).json({
      message: "KYC submitted successfully",
    });
  } catch (err) {
    console.error("KYC submission error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * GET KYC STATUS
 */
export const getKycStatus = async (req, res) => {
  try {
    const kyc = await Kyc.findOne({
      where: { userId: req.user.id },
    });

    if (!kyc) {
      return res.json({ status: "not_submitted" });
    }

    // Return full KYC data if verified, otherwise just status
    if (kyc.status === "verified") {
      res.json({ 
        status: kyc.status, 
        kyc: {
          id: kyc.id,
          fullName: kyc.fullName,
          image: kyc.image, // Profile image path
          status: kyc.status
        }
      });
    } else {
      res.json({ status: kyc.status });
    }
  } catch (err) {
    console.error("Get KYC status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};