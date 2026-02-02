"use client";

import { Calendar, MessageSquare, Phone, Search } from "lucide-react";
import { useInView } from "@/components/useInView";

type Service = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
};

function ServiceCard({ icon, title, description, delay }: Service) {
  const { ref, inView } = useInView<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`service-card transform transition-all duration-700 delay-${delay} ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-start">
        <div className="bg-gradient-phoenix w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-lg">
          <div className="text-charcoal">{icon}</div>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-ash-gray">{description}</p>
      </div>
    </div>
  );
}

export default function Automation() {
  const { ref, inView } = useInView<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services: Service[] = [
    {
      icon: <Phone size={24} />,
      title: "CUSTOM WEBSITES & WEB APPS",
      description:
        "High-performing marketing sites and web apps tailored to your business.",
      delay: 100,
    },
    {
      icon: <MessageSquare size={24} />,
      title: "BACKEND SYSTEMS & INTEGRATIONS",
      description:
        "APIs, data pipelines, and integrations that keep everything connected.",
      delay: 200,
    },
    {
      icon: <Search size={24} />,
      title: "CRM SETUP & AUTOMATION",
      description:
        "CRM configuration, workflows, and handoffs that keep teams aligned.",
      delay: 300,
    },
    {
      icon: <Calendar size={24} />,
      title: "REPORTING & ANALYTICS DASHBOARDS",
      description:
        "Dashboards and reporting that turn data into clear decisions.",
      delay: 400,
    },
  ];

  // Original: #automation grid of service cards with intro copy.
  return (
    <section id="services" className="section-padding bg-charcoal relative">
      <div className="absolute left-0 bottom-0 w-full h-1/3 bg-sunset-orange/5 rounded-full blur-[150px] -z-10" />

      <div className="container mx-auto">
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            SYSTEMS BUILT FOR
            <br />
            <span className="gradient-text">GROWTH.</span>
          </h2>
          <p className="text-ash-gray text-lg md:text-xl">
            We design and implement the systems that keep your business running
            smoothly — from websites to backend logic, CRM workflows, and
            analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
