import { z } from "zod";

export const crmIntakeSchema = z.object({
  // Honeypot (should be empty)
  website: z.string().optional().default(""),

  // 1) Business Basics
  businessName: z.string().trim().min(1, "Business name is required"),
  websiteUrl: z.string().trim().optional().default(""),
  primaryContactName: z.string().trim().min(1, "Primary contact name is required"),
  email: z.string().trim().email("Email must be valid"),
  phone: z.string().trim().min(7, "Phone number looks too short"),
  industryNiche: z.string().trim().optional().default(""),

  // 2) Current Setup
  currentCrmStatus: z.enum(["no_crm", "basic", "advanced"]).default("no_crm"),
  currentCrmPlatforms: z.array(z.string().trim()).optional().default([]),
  currentCrmUsage: z.array(z.string().trim()).optional().default([]),
  currentSystemPainPoints: z.string().trim().optional().default(""),

  // 3) Lead Flow & Sales Process
  leadSources: z.array(z.string().trim()).optional().default([]),
  currentLeadProcess: z.string().trim().optional().default(""),
  leadsGetMissed: z.enum(["often", "sometimes", "rarely", "never"]).default("sometimes"),

  // 4) CRM Goals
  crmGoals: z.array(z.string().trim()).optional().default([]),
  idealOutcome90Days: z.string().trim().optional().default(""),

  // 5) Automation & Features
  desiredAutomations: z.array(z.string().trim()).optional().default([]),
  integrationNeeds: z.string().trim().optional().default(""),

  // 6) Team & Access
  teamSize: z.enum(["just_me", "2_5", "6_10", "10_plus"]).default("just_me"),
  needsDifferentPermissions: z.boolean().default(false),

  // 7) Data & Migration
  hasExistingData: z.boolean().default(false),
  existingDataLocation: z.string().trim().optional().default(""),

  // 8) Priority & Urgency
  urgency: z.enum(["asap", "30_days", "60_90_days", "exploring"]).default("exploring"),
  mainProblemToSolve: z.string().trim().optional().default(""),

  // 9) Budget & Expectations
  budgetRange: z.enum(["under_1k", "1k_3k", "3k_5k", "5k_plus", "not_specified"]).default("not_specified"),
  additionalNotes: z.string().trim().optional().default(""),

  // Agreement
  agreement: z.boolean().refine((v) => v === true, {
    message: "You must agree before submitting",
  }),
});

export type CrmIntakeInput = z.input<typeof crmIntakeSchema>;
export type CrmIntakeData = z.output<typeof crmIntakeSchema>;
