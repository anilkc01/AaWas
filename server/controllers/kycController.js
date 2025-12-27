import Kyc from "../models/kyc.js";


/**
 * GET KYC STATUS
 */
export const getKycStatus = async (req, res) => {
    console.log("Fetching KYC status for user:", req.user.id);
  try {
    const kyc = await Kyc.findOne({
      where: { userId: req.user.id },
    });

    if (!kyc) {
      return res.json({ status: "not_submitted" });
    }

    res.json({ status: kyc.status });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * SUBMIT KYC
 */
export const submitKyc = async (req, res) => {
  try {
    const { fullName, address, email, phone, idType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Document image required",
      });
    }

    const existingKyc = await Kyc.findOne({
      where: { userId: req.user.id },
    });

   
    if (existingKyc && existingKyc.status !== "rejected") {
      return res.status(400).json({
        message: "KYC already submitted and under review",
      });
    }

    //  Re-submit after rejection 
    if (existingKyc && existingKyc.status === "rejected") {
      await existingKyc.update({
        fullName,
        address,
        email,
        phone,
        idType,
        documentImage: req.file.path,
        status: "pending", 
      });

      return res.json({
        message: "KYC resubmitted successfully",
      });
    }

    //new. submission
    await Kyc.create({
      userId: req.user.id,
      fullName,
      address,
      email,
      phone,
      idType,
      documentImage: req.file.path,
      status: "pending",
    });

    res.status(201).json({
      message: "KYC submitted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

