import { z } from "zod";

export const PropertySchema = z.object({
  propertyType: z.string().min(1, "Property type is required"),
  listedFor: z.string().min(1, "Listing type is required"),
  price: z.string().min(1, "Price is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),

  beds: z.number().min(1, "Beds must be at least 1"),
  living: z.number().min(1, "Living rooms must be at least 1"),
  kitchen: z.number().min(1, "Kitchen must be at least 1"),
  washroom: z.number().min(1, "Washroom must be at least 1"),

  isBidding: z.boolean(),
});
