import { z } from "zod";

export const KycSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  idType: z.enum(["citizenship", "passport", "license"]),
});
