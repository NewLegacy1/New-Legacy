import { z } from "zod";

const urlOptional = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || /^https?:\/\//i.test(val), {
    message: "Must be a valid URL (include https://)",
  });

const competitorUrl = z
  .string()
  .trim()
  .url("Competitor link must be a valid URL (include https://)");

export const intakeSchema = z.object({
  // Honeypot (should be empty)
  website: z.string().optional().default(""),

  // 1) Basics
  name: z.string().trim().min(1, "Name is required"),
  businessName: z.string().trim().min(1, "Business name is required"),
  email: z.string().trim().email("Email must be valid"),
  phone: z.string().trim().min(7, "Phone number looks too short"),
  timezone: z.string().trim().min(1, "Timezone is required"),
  addressOrServiceArea: z.string().trim().optional().default(""),

  // 2) Brand & Goals
  whatTheyDo: z.string().trim().min(1, "What you do is required"),
  topGoal: z.string().trim().min(1, "Top goal is required"),
  targetCustomers: z.string().trim().optional().default(""),
  competitors: z.array(competitorUrl).optional().default([]),
  vibe: z.string().trim().optional().default(""),
  colors: z.string().trim().optional().default(""),
  fonts: z.string().trim().optional().default(""),
  logoUrl: urlOptional,

  // 3) Content & Proof
  services: z
    .array(
      z.object({
        serviceName: z.string().trim().min(1, "Service name is required"),
        shortDescription: z
          .string()
          .trim()
          .min(1, "Service description is required"),
      })
    )
    .min(1, "Add at least one service"),
  showPricing: z.enum(["yes", "no", "not_sure"]).default("not_sure"),
  testimonials: z
    .array(
      z.object({
        name: z.string().trim().optional().default(""),
        quote: z.string().trim().optional().default(""),
      })
    )
    .optional()
    .default([]),
  portfolioUrls: z.array(z.string().trim()).optional().default([]),
  teamInfo: z.string().trim().optional().default(""),
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(1, "Question is required"),
        answer: z.string().trim().min(1, "Answer is required"),
      })
    )
    .optional()
    .default([]),

  // 4) Website Structure
  pagesNeeded: z.array(z.string().trim()).optional().default([]),
  ctaPreference: z.string().trim().min(1, "CTA preference is required"),
  formsNeeded: z.array(z.string().trim()).optional().default([]),
  integrations: z.string().trim().optional().default(""),
  tracking: z.string().trim().optional().default(""),

  // 5) Build Call & Revisions
  attendees: z.string().trim().optional().default(""),
  schedulingPreference: z.enum(["asap", "this_week", "next_week", "flexible"]).default("flexible"),
  revisionNotes: z.string().trim().optional().default(""),
  approvalContact: z.string().trim().min(1, "Approval contact is required"),
  communicationChannel: z
    .enum(["email", "sms", "slack", "other"])
    .default("email"),
  deadline: z.string().trim().optional().default(""),
  deadlineAck: z.boolean().optional().default(false),
  agreement: z.boolean().refine((v) => v === true, {
    message: "You must agree before submitting",
  }),

  // UX extras
  copyMode: z.enum(["write_for_me", "i_will_provide"]).default("write_for_me"),
});

// Form data shape (pre-parse) vs parsed output shape (post-parse defaults).
export type IntakeInput = z.input<typeof intakeSchema>;
export type IntakeData = z.output<typeof intakeSchema>;

