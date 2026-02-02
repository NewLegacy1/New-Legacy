"use client";

import { ArrowUp } from "lucide-react";
import { useInView } from "@/components/useInView";

export default function StartNow() {
  const { ref, inView } = useInView<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Original: #start-now CTA block with back-to-top button.
  return (
    <section id="start-now" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-phoenix-gold/10 to-sunset-orange/10 mix-blend-overlay" />

      <div
        ref={ref}
        className={`container mx-auto text-center max-w-4xl transition-all duration-700 ${
          inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-phoenix-gold to-sunset-orange rounded-xl blur-xl opacity-20 animate-pulse" />
          <div className="relative bg-charcoal/80 backdrop-blur-md border border-phoenix-gold/20 rounded-xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6">
              READY TO <span className="gradient-text">BUILD IT RIGHT?</span>
            </h2>
            <p className="text-ash-gray text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              If your website looks good but your systems feel messy, we can
              fix both — and make everything measurable.
            </p>
            <a href="/checkout" className="btn-primary inline-flex items-center">
              BOOK A CONSULTATION
            </a>

            <div className="absolute bottom-4 right-4">
              <a
                href="#home"
                className="w-10 h-10 rounded-full bg-phoenix-gold/20 flex items-center justify-center hover:bg-phoenix-gold/30 transition-colors"
                aria-label="Back to top"
              >
                <ArrowUp className="text-phoenix-gold" size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
