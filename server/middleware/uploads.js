import multer from "multer";
import path from "path";
import fs from "fs";

/*
 * Create folder if it doesn't exist
 */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/*
 * Multer storage factory
 */
const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `uploads/${folder}`;
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });

/*
 * File filter (images only)
 */
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

/*
 * Reusable upload factory
 */
const upload = (folder, options = {}) => {
  const {
    multiple = false,
    max = 5,
    field = "image",
    size = 5 * 1024 * 1024,
  } = options;

  const multerUpload = multer({
    storage: storage(folder),
    fileFilter,
    limits: { fileSize: size },
  });

  return multiple
    ? multerUpload.array(field, max)
    : multerUpload.single(field);
};

/*
 * Property images upload middleware
 * Temporarily stores in uploads/properties (temp location)
 * Files will be moved to property-specific folders after property creation
 */
export const uploadPropertyImages = multer({
  storage: storage("properties"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "dpImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

/*
 * KYC upload middleware
 * Temporarily stores in uploads/kyc (temp location)
 * Files will be moved to user-specific folders after KYC submission
 */
export const uploadKycImages = multer({
  storage: storage("kyc"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "documentImage", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

export default upload;