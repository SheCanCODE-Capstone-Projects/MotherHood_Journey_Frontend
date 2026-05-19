import { z } from "zod";

export const childSchema = z.object({
  mother_health_id: z.string().min(1, "Mother's health ID is required"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  gender: z.enum(["MALE", "FEMALE"]).refine(
  (value) => value !== undefined,
  { message: "Gender is required" }
),
  date_of_birth: z
    .string()
    .refine((date) => {
      const dob = new Date(date);
      return dob <= new Date();
    }, "Date of birth cannot be in the future")
    .refine((date) => {
      return !isNaN(Date.parse(date));
    }, "Invalid date format"),
  birth_weight: z
    .number()
    .min(0.5, "Birth weight must be at least 0.5 kg")
    .max(8, "Birth weight cannot exceed 8 kg"),
  delivery_type: z.enum(["NORMAL", "CAESAREAN", "ASSISTED"])
  .refine(
    (value) => value !== undefined && value !== null,
    { message: "Delivery method is required" }
  ),
  birth_certificate_number: z.string().optional(),
});

export type ChildFormData = z.infer<typeof childSchema>;
