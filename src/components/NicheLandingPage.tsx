"use client";

import { useEffect } from "react";
import { ArrowUp, CheckCircle } from "lucide-react";
import { useInView } from "@/components/useInView";
import { CALENDLY_CONSULTATION_URL } from "@/lib/links";

export type NicheValueProp = {
  title: string;
  description: string;
};

export type NicheProofMetric = {
  value: string;
  label: string;
};

export type NicheProof = {
  quote?: string;
  company?: string;
  industry?: string;
  metrics?: NicheProofMetric[];
};

export type NicheConfig = {
  headline: string;
  headlineHighlight?: string; // Part of headline to show with gradient (e.g. "A WEBSITE THAT WORKS.")
  subhead: string;
  valueProps: NicheValueProp[];
  proof: NicheProof;
};

type NicheLandingPageProps = {
  config: NicheConfig;
};

function NicheHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-ash-gray/20">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <a href="/" className="flex items-center">
          <img src="/new-legacy-logo.png" alt="New Legacy AI" className="w-12 h-12" />
        </a>
      </div>
    </header>
  );
}

export default function NicheLandingPage({ config }: NicheLandingPageProps) {
  const { headline, headlineHighlight, subhead, valueProps, proof } = config;
  const heroRef = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.1 });
  const trustRef = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.1 });
  const proofRef = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.1 });
  const ctaRef = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const headlineParts = headlineHighlight
    ? headline.split(headlineHighlight)
    : [headline];

  return (
    <div className="min-h-screen bg-charcoal text-pure-white">
      <NicheHeader />

      {/* Hero */}
      <section id="home" className="flex items-center pt-20 pb-16 md:pb-20 relative">
        <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-phoenix-gold/5 rounded-full blur-[100px] -z-10" />
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              ref={heroRef.ref}
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-6xl leading-tight transition-all duration-700 ${
                heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {headlineParts[0]}
              {headlineHighlight && (
                <span className="gradient-text">{headlineHighlight}</span>
              )}
              {headlineParts[1]}
            </h1>
            <p
              className={`text-xl sm:text-2xl text-ash-gray font-light max-w-2xl mx-auto mt-6 mb-12 transition-all duration-700 delay-200 ${
                heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {subhead}
            </p>
            <div
              className={`transition-all duration-700 delay-400 ${
                heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <a
                href={CALENDLY_CONSULTATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                BOOK A CONSULTATION
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust - Value Props */}
      <section className="py-16 md:py-20 bg-charcoal relative">
        <div className="absolute left-0 top-1/4 w-1/3 h-1/3 bg-sunset-orange/5 rounded-full blur-[100px] -z-10" />
        <div className="container mx-auto">
          <div
            ref={trustRef.ref}
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
              trustRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {valueProps.map((item, index) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-6 border border-ash-gray/20 rounded-lg hover:border-phoenix-gold/30 hover:bg-phoenix-gold/5 transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CheckCircle className="text-phoenix-gold shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-syne text-lg mb-2">{item.title}</h3>
                  <p className="text-ash-gray">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 md:py-20 bg-charcoal relative">
        <div className="absolute right-0 bottom-0 w-1/3 h-1/3 bg-phoenix-gold/5 rounded-full blur-[100px] -z-10" />
        <div className="container mx-auto">
          <div
            ref={proofRef.ref}
            className={`max-w-2xl mx-auto transition-all duration-700 ${
              proofRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-charcoal/80 backdrop-blur-md border border-ash-gray/20 rounded-xl p-8 hover:border-phoenix-gold/50 transition-colors">
              {proof.quote && (
                <blockquote className="text-ash-gray italic text-lg mb-6">
                  &ldquo;{proof.quote}&rdquo;
                </blockquote>
              )}
              {(proof.company || proof.industry) && (
                <p className="text-pure-white font-syne mb-6">
                  {proof.company}
                  {proof.industry && (
                    <span className="text-ash-gray font-normal"> — {proof.industry}</span>
                  )}
                </p>
              )}
              {proof.metrics && proof.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {proof.metrics.map((metric) => (
                    <div key={metric.label} className="text-center">
                      <div className="bg-gradient-phoenix w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-charcoal font-syne font-bold text-sm">
                          {metric.value}
                        </span>
                      </div>
                      <div className="text-ash-gray text-sm">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="start-now" className="py-20 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-phoenix-gold/10 to-sunset-orange/10 mix-blend-overlay" />
        <div
          ref={ctaRef.ref}
          className={`container mx-auto text-center max-w-4xl transition-all duration-700 ${
            ctaRef.inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-phoenix-gold to-sunset-orange rounded-xl blur-xl opacity-20 animate-pulse" />
            <div className="relative bg-charcoal/80 backdrop-blur-md border border-phoenix-gold/20 rounded-xl p-10 md:p-12 shadow-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl pt-4 mb-6">
                READY TO <span className="gradient-text">BUILD IT RIGHT?</span>
              </h2>
              <p className="text-ash-gray text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Let&apos;s talk about your systems — and how we can make them work for you.
              </p>
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 mb-12 sm:mb-8">
                <a
                  href={CALENDLY_CONSULTATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center"
                >
                  BOOK A CONSULTATION
                </a>
                <button
                  type="button"
                  onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
                  className="sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 w-10 h-10 rounded-full bg-phoenix-gold/20 flex items-center justify-center hover:bg-phoenix-gold/30 transition-colors shrink-0"
                  aria-label="Back to top"
                >
                  <ArrowUp className="text-phoenix-gold" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
