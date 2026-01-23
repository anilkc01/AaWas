import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

/**
 * Ensure property directory exists
 */
export const ensurePropertyDir = (propertyId) => {
  const dir = path.join("uploads", "properties", String(propertyId));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

/**
 * Delete a file safely
 */
export const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
  }
};

/**
 * Delete entire property folder
 */
export const deletePropertyFolder = (propertyId) => {
  const dir = path.join("uploads", "properties", String(propertyId));
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch (error) {
    console.error(`Failed to delete folder: ${dir}`, error);
  }
};

/**
 * Move file to property-specific folder
 */
export const moveToPropertyFolder = (sourcePath, propertyId, filename) => {
  const propertyDir = ensurePropertyDir(propertyId);
  const destPath = path.join(propertyDir, filename);

  try {
    fs.renameSync(sourcePath, destPath);
    return path.join(
      "uploads",
      "properties",
      String(propertyId),
      filename
    );
  } catch (error) {
    console.error("Failed to move file:", error);
    return sourcePath;
  }
};

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AaWAS Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #B59353;">AaWAS Real Estate</h2>
          <div style="font-size: 14px; color: #333;">
            ${htmlContent}
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            This is an automated message, please do not reply.
          </p>
        </div>
      `,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Email Helper Error:", error);
    throw new Error("Failed to send email");
  }
};