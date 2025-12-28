import Property from "../models/property.js";

/**
 * GET MY PROPERTIES
 */
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * CREATE PROPERTY
 */export const createProperty = async (req, res) => {
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

    // Check if files were uploaded
    if (!req.files || !req.files.dpImage) {
      return res.status(400).json({
        message: "Display image (dpImage) is required",
      });
    }

    // Get the display picture (it's an array, so take first element)
    const dpImage = req.files.dpImage[0].path;

    // Get additional images (optional)
    const images = req.files.images 
      ? req.files.images.map((file) => file.path) 
      : [];

    const property = await Property.create({
      userId: req.user.id,
      propertyType,
      listedFor,
      price: parseInt(price),
      location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      description,
      beds: parseInt(beds) || 0,
      living: parseInt(living) || 0,
      kitchen: parseInt(kitchen) || 0,
      washroom: parseInt(washroom) || 0,
      dpImage,
      images,
      isBidding: isBidding === "true" || isBidding === true,
    });

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};