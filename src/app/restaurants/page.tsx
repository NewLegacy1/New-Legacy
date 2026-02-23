import NicheLandingPage from "@/components/NicheLandingPage";
import type { NicheConfig } from "@/components/NicheLandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restaurants | New Legacy AI",
  description:
    "Websites, online ordering, and reservation flows that bring in more diners and keep your team organized.",
};

const restaurantsConfig: NicheConfig = {
  headline: "YOUR RESTAURANT DESERVES SYSTEMS THAT SCALE.",
  headlineHighlight: "SYSTEMS THAT SCALE.",
  subhead:
    "Websites, online ordering, and reservation flows that bring in more diners and keep your team organized.",
  valueProps: [
    {
      title: "Menus, reservations & ordering",
      description:
        "Smooth online ordering, table bookings, and menu updates — all in one place that works for your guests.",
    },
    {
      title: "Automated follow-up for repeat guests",
      description:
        "Keep diners coming back with smart follow-up and loyalty flows that run without extra staff time.",
    },
    {
      title: "Less chaos, more capacity",
      description:
        "Systems that handle the busy work so your team can focus on service and the experience that keeps people coming.",
    },
  ],
  proof: {
    quote:
      "Scheduling and follow-ups are streamlined now. Our staff can focus on what matters most — the food and our guests.",
    company: "WELLNESS CENTRAL KITCHEN",
    industry: "Restaurant",
    metrics: [
      { value: "45%", label: "More Online Orders" },
      { value: "98%", label: "Response Rate" },
      { value: "60%", label: "Fewer No-Shows" },
    ],
  },
};

export default function RestaurantsPage() {
  return <NicheLandingPage config={restaurantsConfig} />;
}
