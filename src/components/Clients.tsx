"use client";

import {
  Briefcase,
  Building2,
  Home,
  LandPlot,
  LineChart,
  Stethoscope,
} from "lucide-react";
import { useInView } from "@/components/useInView";

type Industry = {
  icon: React.ReactNode;
  name: string;
  delay: number;
};

function IndustryCard({ icon, name, delay }: Industry) {
  const { ref, inView } = useInView<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center p-6 border border-ash-gray/20 rounded-lg transition-all duration-700 delay-${delay} hover:border-phoenix-gold/50 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-gradient-phoenix w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <div className="text-charcoal">{icon}</div>
      </div>
      <p className="font-syne text-center">{name}</p>
    </div>
  );
}

export default function Clients() {
  const { ref, inView } = useInView<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
  });

  const industries: Industry[] = [
    { icon: <Stethoscope size={32} />, name: "HEALTHCARE", delay: 100 },
    { icon: <Home size={32} />, name: "REAL ESTATE", delay: 200 },
    { icon: <Briefcase size={32} />, name: "LAW FIRMS", delay: 300 },
    { icon: <LandPlot size={32} />, name: "HOME SERVICES", delay: 400 },
    { icon: <Building2 size={32} />, name: "FINANCIAL SERVICES", delay: 500 },
    { icon: <LineChart size={32} />, name: "CONSULTING", delay: 600 },
  ];

  // Original: #clients industry grid with overlay background.
  return (
    <section
      id="clients"
      className="section-padding pt-32 md:pt-40 bg-gradient-to-b from-charcoal to-charcoal/95 relative"
    >
      <div className="absolute inset-0 bg-phoenix-gold/5 mix-blend-overlay" />

      <div className="container mx-auto">
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            WE AUTOMATE FOR THE
            <br />
            <span className="gradient-text">BUSINESSES THAT MOVE FAST.</span>
          </h2>
          <p className="text-ash-gray text-lg md:text-xl">
            Whether you run a clinic, a closing team, or a service brand — we
            build systems that move with you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((industry) => (
            <IndustryCard key={industry.name} {...industry} />
          ))}
        </div>
      </div>
    </section>
  );
}
