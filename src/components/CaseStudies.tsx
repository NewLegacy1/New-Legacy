"use client";

import { Clock, TrendingUp, Users } from "lucide-react";
import { useInView } from "@/components/useInView";

type Metric = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

type CaseStudy = {
  company: string;
  industry: string;
  metrics: Metric[];
  testimonial: string;
  delay: number;
};

function CaseStudyCard({
  company,
  industry,
  metrics,
  testimonial,
  delay,
}: CaseStudy) {
  const { ref, inView } = useInView<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`bg-charcoal/80 backdrop-blur-md border border-ash-gray/20 rounded-xl p-8 transition-all duration-700 delay-${delay} hover:border-phoenix-gold/50 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1">{company}</h3>
        <p className="text-ash-gray">{industry}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div className="bg-gradient-phoenix w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <div className="text-charcoal">{metric.icon}</div>
            </div>
            <div className="font-syne font-bold text-lg">{metric.value}</div>
            <div className="text-ash-gray text-sm">{metric.label}</div>
          </div>
        ))}
      </div>

      <blockquote className="text-ash-gray italic">"{testimonial}"</blockquote>
    </div>
  );
}

export default function CaseStudies() {
  const { ref, inView } = useInView<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
  });

  const caseStudies: CaseStudy[] = [
    {
      company: "ELITE REALTY GROUP",
      industry: "Real Estate",
      metrics: [
        { icon: <Clock size={20} />, value: "20hrs", label: "Saved Weekly" },
        { icon: <Users size={20} />, value: "3x", label: "Lead Response" },
        { icon: <TrendingUp size={20} />, value: "45%", label: "More Bookings" },
      ],
      testimonial:
        "The intake flow handles our initial client conversations so naturally, most people assume it's a live agent.",
      delay: 100,
    },
    {
      company: "WELLNESS CENTRAL",
      industry: "Healthcare",
      metrics: [
        { icon: <Clock size={20} />, value: "15hrs", label: "Saved Weekly" },
        { icon: <Users size={20} />, value: "98%", label: "Response Rate" },
        { icon: <TrendingUp size={20} />, value: "60%", label: "Less No-Shows" },
      ],
      testimonial:
        "Scheduling and follow-ups are streamlined now. Our staff can focus on what matters most - patient care.",
      delay: 200,
    },
    {
      company: "APEX LAW PARTNERS",
      industry: "Legal Services",
      metrics: [
        { icon: <Clock size={20} />, value: "25hrs", label: "Saved Weekly" },
        { icon: <Users size={20} />, value: "4x", label: "Client Intake" },
        { icon: <TrendingUp size={20} />, value: "70%", label: "Faster Response" },
      ],
      testimonial:
        "Our intake and screening workflow runs smoothly. We're able to take on more clients without increasing our administrative burden.",
      delay: 300,
    },
  ];

  // Original: #case-studies grid of testimonial cards.
  return (
    <section id="case-studies" className="section-padding bg-charcoal relative">
      <div className="absolute right-0 bottom-0 w-1/3 h-1/3 bg-phoenix-gold/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto">
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            REAL BUILDS. <span className="gradient-text">REAL OUTCOMES.</span>
          </h2>
          <p className="text-ash-gray text-lg md:text-xl">
            Every project is designed to remove friction, improve clarity, and
            support growth — not just look good.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.company} {...study} />
          ))}
        </div>
      </div>
    </section>
  );
}
