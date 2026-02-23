import NicheLandingPage from "@/components/NicheLandingPage";
import type { NicheConfig } from "@/components/NicheLandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental & Medical Practices | New Legacy AI",
  description:
    "Patient-friendly websites, scheduling, and intake flows that reduce no-shows and free up your staff.",
};

const dentalMedicalConfig: NicheConfig = {
  headline: "YOUR PRACTICE DESERVES SYSTEMS THAT RUN SMOOTH.",
  headlineHighlight: "SYSTEMS THAT RUN SMOOTH.",
  subhead:
    "Patient-friendly websites, scheduling, and intake flows that reduce no-shows and free up your staff.",
  valueProps: [
    {
      title: "Patient intake & scheduling",
      description:
        "Smooth online intake and booking that reduces front-desk load and gets patients in the door with less friction.",
    },
    {
      title: "HIPAA-aware automations",
      description:
        "Follow-up, reminders, and routing built with patient privacy in mind — so you can automate safely.",
    },
    {
      title: "Less front-desk chaos",
      description:
        "Systems that handle the repetitive work so your team can focus on patient care and practice growth.",
    },
  ],
  proof: {
    quote:
      "Scheduling and follow-ups are streamlined now. Our staff can focus on what matters most — patient care.",
    company: "WELLNESS CENTRAL",
    industry: "Healthcare",
    metrics: [
      { value: "60%", label: "Fewer No-Shows" },
      { value: "15hrs", label: "Saved Weekly" },
      { value: "98%", label: "Response Rate" },
    ],
  },
};

export default function DentalMedicalPage() {
  return <NicheLandingPage config={dentalMedicalConfig} />;
}
