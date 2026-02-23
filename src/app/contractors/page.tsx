import NicheLandingPage from "@/components/NicheLandingPage";
import type { NicheConfig } from "@/components/NicheLandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contractors & Trades | New Legacy AI",
  description:
    "Custom websites and lead systems for plumbers, electricians, HVAC, and home service pros — built to book more jobs.",
};

const contractorsConfig: NicheConfig = {
  headline: "YOUR TRADE DESERVES A WEBSITE THAT WORKS.",
  headlineHighlight: "A WEBSITE THAT WORKS.",
  subhead:
    "Custom sites and lead systems for plumbers, electricians, HVAC, and home service pros — built to book more jobs.",
  valueProps: [
    {
      title: "Job-ready websites",
      description:
        "Professional sites that showcase your work, capture leads, and make it easy for customers to book you.",
    },
    {
      title: "Lead capture & follow-up",
      description:
        "Systems that capture every inquiry and follow up automatically — so you never miss a job.",
    },
    {
      title: "Less admin, more billable hours",
      description:
        "Streamline scheduling, estimates, and communication so you can focus on the work that pays.",
    },
  ],
  proof: {
    quote:
      "The intake flow handles our initial client conversations so naturally, most people assume it's a live agent.",
    company: "ELITE HOME SERVICES",
    industry: "Contractors",
    metrics: [
      { value: "20hrs", label: "Saved Weekly" },
      { value: "3x", label: "More Leads" },
      { value: "45%", label: "More Bookings" },
    ],
  },
};

export default function ContractorsPage() {
  return <NicheLandingPage config={contractorsConfig} />;
}
