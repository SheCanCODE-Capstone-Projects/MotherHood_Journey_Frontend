import { z } from "zod";

/**
 * Rwanda NID validation: 16-digit number
 */
const rwandaNIDRegex = /^\d{16}$/;

/**
 * Step 1 Validation Schema
 * - National ID: Must be exactly 16 digits (Rwanda NID format)
 * - First and Last Names: Non-empty strings
 * - Date of Birth: Valid date in the past
 * - Phone Number: Valid phone number
 */
export const motherRegistrationStepOneSchema = z.object({
  national_id: z
    .string()
    .min(1, "National ID is required")
    .regex(
      rwandaNIDRegex,
      "National ID must be exactly 16 digits (Rwanda NID format)"
    ),
  first_name: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate < today;
    }, "Date of birth must be in the past"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+250|0)[1-9]\d{7,8}$/,
      "Phone number must be a valid Rwanda phone number"
    ),
});

/**
 * Step 2 Validation Schema
 * - Home Location: Non-empty string
 * - Education Level: Must be one of the predefined options
 */
export const motherRegistrationStepTwoSchema = z.object({
  home_location: z
    .string()
    .min(1, "Home location is required"),
  education_level: z
    .string()
    .min(1, "Education level is required")
    .refine(
      (value) => ["primary", "secondary", "tertiary", "none"].includes(value),
      "Please select a valid education level"
    ),
});

/**
 * Complete Form Schema
 * Combines both step schemas for final validation before submission
 */
export const motherRegistrationSchema = motherRegistrationStepOneSchema
  .merge(motherRegistrationStepTwoSchema);

export type MotherRegistrationStepOne = z.infer<
  typeof motherRegistrationStepOneSchema
>;
export type MotherRegistrationStepTwo = z.infer<
  typeof motherRegistrationStepTwoSchema
>;
export type MotherRegistrationData = z.infer<typeof motherRegistrationSchema>;
