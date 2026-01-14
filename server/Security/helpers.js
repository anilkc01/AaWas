import fs from "fs";
import path from "path";

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
