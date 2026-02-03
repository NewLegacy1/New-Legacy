import { z } from "zod";

// Optional URL: blank is allowed; if present must start with http(s)://
const websiteUrlOptional = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((val) => (val ? val : undefined))
  .refine((val) => !val || /^https?:\/\//i.test(val), {
    message: "Must be a valid URL (include https://)",
  });

export const leadSchema = z.object({
  // Honeypot (should be empty)
  website: z.string().optional().default(""),

  name: z.string().trim().min(1, "Name is required"),
  businessName: z.string().trim().optional().default(""),
  email: z.string().trim().email("Email must be valid"),
  phone: z.string().trim().optional().default(""),
  websiteUrl: websiteUrlOptional,

  servicesInterested: z
    .array(z.string().trim())
    .min(1, "Select at least one service"),

  message: z.string().trim().optional().default(""),
  preferredContact: z.enum(["email", "phone"]).default("email"),

  // Context
  sourcePath: z.string().trim().optional().default(""),
  utm: z.record(z.string(), z.string()).optional().default({}),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;

