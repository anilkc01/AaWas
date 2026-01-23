import { z } from "zod";

export const ForgotPasswordStep1Schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export const ForgotPasswordStep2Schema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});


export const ForgotPasswordStep3Schema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
});