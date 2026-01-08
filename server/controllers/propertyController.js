import Property from "../models/property.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import User from "../models/User.js";
import Kyc from "../models/Kyc.js";

/**
 * Helper: Ensure property directory exists
 */
const ensurePropertyDir = (propertyId) => {
  const dir = `uploads/properties/${propertyId}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

/**
 * Helper: Delete a file safely
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
  }
};

/**
 * Helper: Delete entire property folder
 */
const deletePropertyFolder = (propertyId) => {
  const dir = `uploads/properties/${propertyId}`;
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch (error) {
    console.error(`Failed to delete folder: ${dir}`, error);
  }
};

/**
 * Helper: Move file to property-specific folder
 */
const moveToPropertyFolder = (sourcePath, propertyId, filename) => {
  const propertyDir = ensurePropertyDir(propertyId);
  const destPath = path.join(propertyDir, filename);
  
  try {
    fs.renameSync(sourcePath, destPath);
    return `uploads/properties/${propertyId}/${filename}`;
  } catch (error) {
    console.error('Failed to move file:', error);
    return sourcePath;
  }
};

/**
 * CREATE Property
 */
export const createProperty = async (req, res) => {
  try {
    const {
      propertyType,
      listedFor,
      price,
      location,
      latitude,
      longitude,
      description,
      beds,
      living,
      kitchen,
      washroom,
      isBidding,
    } = req.body;

    // Validate required fields
    if (!req.files?.dpImage?.[0]) {
      return res.status(400).json({ message: "Display image is required" });
    }

    // Create property first to get the ID
    const property = await Property.create({
      propertyType,
      listedFor,
      price,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      description,
      beds: beds || 1,
      living: living || 1,
      kitchen: kitchen || 1,
      washroom: washroom || 1,
      isBidding: isBidding === "true",
      dpImage: req.files.dpImage[0].path,
      images: req.files.images?.map((f) => f.path) || [],
      userId: req.user.id,
    });

    // Move files to property-specific folder
    const propertyId = property.id;
    const propertyDir = ensurePropertyDir(propertyId);

    // Move display image
    const dpImageFilename = path.basename(req.files.dpImage[0].path);
    const newDpPath = moveToPropertyFolder(
      req.files.dpImage[0].path,
      propertyId,
      dpImageFilename
    );

    // Move additional images
    const newImagePaths = [];
    if (req.files.images) {
      for (const img of req.files.images) {
        const filename = path.basename(img.path);
        const newPath = moveToPropertyFolder(img.path, propertyId, filename);
        newImagePaths.push(newPath);
      }
    }

    // Update property with new paths
    property.dpImage = newDpPath;
    property.images = newImagePaths;
    await property.save();

    res.status(201).json(property);
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ message: "Failed to create property" });
  }
};

/**
 * UPDATE Property
 */
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check ownership
    if (property.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const propertyDir = ensurePropertyDir(id);
    const updates = { ...req.body };

    // Handle display image update
    if (req.files?.dpImage?.[0]) {
      // Delete old display image
      if (property.dpImage) {
        deleteFile(property.dpImage);
      }

      // Move new display image to property folder
      const dpImageFilename = path.basename(req.files.dpImage[0].path);
      const newDpPath = moveToPropertyFolder(
        req.files.dpImage[0].path,
        id,
        dpImageFilename
      );
      updates.dpImage = newDpPath;
    }

    // Handle additional images update
    if (req.files?.images && req.files.images.length > 0) {
      // Delete old additional images
      if (property.images && property.images.length > 0) {
        property.images.forEach((img) => deleteFile(img));
      }

      // Move new images to property folder
      const newImagePaths = [];
      for (const img of req.files.images) {
        const filename = path.basename(img.path);
        const newPath = moveToPropertyFolder(img.path, id, filename);
        newImagePaths.push(newPath);
      }
      updates.images = newImagePaths;
    }

    // Convert boolean strings
    if (updates.isBidding !== undefined) {
      updates.isBidding = updates.isBidding === "true" || updates.isBidding === true;
    }

    // Convert numeric strings
    ['price', 'beds', 'living', 'kitchen', 'washroom', 'latitude', 'longitude'].forEach(field => {
      if (updates[field] !== undefined && updates[field] !== null && updates[field] !== '') {
        updates[field] = Number(updates[field]);
      }
    });

    // Update property
    await property.update(updates);

    res.json(property);
  } catch (error) {
    console.error("Update property error:", error);
    res.status(500).json({ message: "Failed to update property" });
  }
};

/**
 * DELETE Property
 */
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check ownership
    if (property.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete entire property folder with all images
    deletePropertyFolder(id);

    // Delete from database
    await property.destroy();

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ message: "Failed to delete property" });
  }
};

/**
 * GET My Properties
 */
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json(properties);
  } catch (error) {
    console.error("Get my properties error:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

/**
 * GET Single Property
 */
export const getPropertyById = async (req, res) => {
  
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "fullName"],
          include: [
            {
              model: Kyc,
              attributes: ["image"],
            },
          ],
        },
      ],
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("Get property error:", error);
    res.status(500).json({ message: "Failed to fetch property" });
  }
};

/**
 * GET All Properties (Public - for browsing)
 */
export const getAllProperties = async (req, res) => {
  try {
    const { propertyType, listedFor, minPrice, maxPrice } = req.query;
    
    const where = { isAvailable: true };
    
    if (propertyType) where.propertyType = propertyType;
    if (listedFor) where.listedFor = listedFor;
    if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

    const properties = await Property.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json(properties);
  } catch (error) {
    console.error("Get all properties error:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};



/**
 * GET All Properties (Public - for browsing)
 */
export const browseProperties = async (req, res) => {
  try {
    const userId = req.user.id;

    const properties = await Property.findAll({
      where: {
        userId: { [Op.ne]: userId },
        status: "available",
      },
      attributes: [
        "id",
        "dpImage",
        "location",
        "price",
        "beds",
        "kitchen",
        "washroom",
        "living",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

/**
 * DISABLE/MARK UNAVAILABLE Property
 */
export const disableProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check ownership
    if (property.owner !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Toggle availability
    property.isAvailable = !property.isAvailable;
    await property.save();

    res.json({
      message: property.isAvailable
        ? "Property marked as available"
        : "Property marked as unavailable",
      property,
    });
  } catch (error) {
    console.error("Disable property error:", error);
    res.status(500).json({ message: "Failed to update property status" });
  }
};