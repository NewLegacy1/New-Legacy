"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesScroll from "@/components/ServicesScroll";
import Clients from "@/components/Clients";
import WhyUs from "@/components/WhyUs";
import CaseStudies from "@/components/CaseStudies";
import StartNow from "@/components/StartNow";
import Footer from "@/components/Footer";

export default function HomePage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-charcoal text-pure-white">
      <Navbar />
      <Hero />
      <ServicesScroll />
      <Clients />
      <WhyUs />
      <CaseStudies />
      <StartNow />
      <Footer />
    </div>
  );
}
