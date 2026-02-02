"use client";

import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { useInView } from "@/components/useInView";

const valueProps = [
  {
    title: "Strategy-first builds",
    description:
      "We design around your goals, not a template library.",
  },
  {
    title: "Clean, scalable architecture",
    description:
      "Systems that are reliable today and easy to extend tomorrow.",
  },
  {
    title: "Clear communication and timelines",
    description:
      "Transparent process, tight feedback loops, and predictable delivery.",
  },
  {
    title: "Systems designed to evolve",
    description:
      "Built to adapt as your business grows and priorities shift.",
  },
  {
    title: "Ongoing optimization & support",
    description:
      "Long-term support to keep performance, uptime, and data clean.",
  },
];

export default function WhyUs() {
  const { ref, inView } = useInView<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Original: #why-us split layout with value prop list.
  return (
    <section id="why-us" className="section-padding bg-charcoal relative">
      <div className="absolute left-0 top-1/4 w-1/3 h-1/3 bg-sunset-orange/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div
            ref={ref}
            className={`w-full lg:w-1/2 transition-all duration-700 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-phoenix-gold to-sunset-orange rounded-2xl blur-xl opacity-10" />
              <div className="relative bg-charcoal/60 backdrop-blur-sm border border-ash-gray/20 rounded-xl p-8 shadow-2xl">
                <Sparkles className="text-phoenix-gold mb-6" size={48} />
                <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6">
                  WHY NEW
                  <br />
                  <span className="gradient-text">LEGACY.</span>
                </h2>
                <p className="text-ash-gray text-lg mb-8">
                  We don&apos;t sell software or templates. We design systems
                  around how your business actually operates — and where it&apos;s
                  going next.
                </p>
                <a
                  href="https://api.leadconnectorhq.com/widget/booking/LVNlkCPBjoVt8iwDpZUR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-phoenix-gold font-syne font-bold group"
                >
                  START YOUR PROJECT
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-2" />
                </a>
              </div>
            </div>
          </div>

          <div
            className={`w-full lg:w-1/2 transition-all duration-700 delay-300 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <ul className="space-y-6">
              {valueProps.map((item, index) => (
                <li
                  key={item.title}
                  className={`flex items-start gap-4 p-4 border border-ash-gray/20 rounded-lg transition-all duration-500 delay-${
                    index * 100
                  } hover:border-phoenix-gold/30 hover:bg-phoenix-gold/5 ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="text-phoenix-gold shrink-0 mt-1" />
                  <div>
                    <h3 className="font-syne text-lg mb-1">{item.title}</h3>
                    <p className="text-ash-gray">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
