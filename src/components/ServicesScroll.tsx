"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CALENDLY_CONSULTATION_URL } from "@/lib/links";

const SERVICES = [
  {
    title: "Custom Websites",
    body:
      "High-performance websites and web apps built for speed, SEO, and conversion — tailored to your offer, not a template.",
    bullets: [
      "Landing pages and full sites",
      "Performance and SEO foundations",
      "Conversion-first structure",
    ],
    imageSrc: null,
  },
  {
    title: "CRM Workflows",
    body:
      "CRM setup and automations that capture leads, route them correctly, and keep follow-up consistent.",
    bullets: [
      "Pipelines and lifecycle stages",
      "Email/SMS automations",
      "Lead routing and tagging",
    ],
    imageSrc: "/crm%20img.png",
  },
  {
    title: "Backend Systems",
    body:
      "APIs, integrations, and backend logic that keep operations smooth, with reporting that turns data into decisions.",
    bullets: [
      "Databases, APIs, and data pipelines",
      "Third-party integrations",
      "Dashboards and reporting views",
    ],
    imageSrc: null,
  },
  {
    title: "Custom App Solutions",
    body:
      "Purpose-built apps that streamline workflows, eliminate manual work, and scale with your team.",
    bullets: [
      "Internal tools and admin portals",
      "Workflow automation and approvals",
      "Role-based access and auditing",
    ],
    imageSrc: "/image.png",
  },
];

export default function ServicesScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const lastScrollYRef = useRef(0);
  const autoAdvanceRef = useRef(false);
  const upSnapRef = useRef(false);
  const snapCooldownRef = useRef(false);

  const sectionHeight = useMemo(
    () => `${SERVICES.length * 100}vh`,
    []
  );

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeightPx = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = Math.max(sectionHeightPx - viewportHeight, 1);
      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollYRef.current;

      const progress = Math.min(Math.max((scrollY - sectionTop) / maxScroll, 0), 1);
      const nextIndex = Math.min(
        Math.max(Math.floor(progress * SERVICES.length), 0),
        SERVICES.length - 1
      );
      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));

      const shouldPin =
        scrollY >= sectionTop && scrollY <= sectionTop + sectionHeightPx - viewportHeight;
      setIsPinned(shouldPin);

      const snapUpThreshold = sectionTop + sectionHeightPx - viewportHeight + 360;
      const isBelowSection = scrollY > sectionTop + sectionHeightPx - viewportHeight;
      if (!scrollingDown && isBelowSection) {
        if (scrollY <= snapUpThreshold && !upSnapRef.current && !snapCooldownRef.current) {
          upSnapRef.current = true;
          snapCooldownRef.current = true;
          window.scrollTo({ top: sectionTop, behavior: "smooth" });
          window.setTimeout(() => {
            snapCooldownRef.current = false;
          }, 600);
        }
      } else {
        upSnapRef.current = false;
      }

      if (nextIndex === SERVICES.length - 1 && progress >= 0.98 && scrollingDown) {
        if (!autoAdvanceRef.current) {
          const nextSection = sectionRef.current.nextElementSibling as HTMLElement | null;
          if (nextSection) {
            autoAdvanceRef.current = true;
            nextSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      } else if (!scrollingDown || progress < 0.98) {
        autoAdvanceRef.current = false;
      }

      lastScrollYRef.current = scrollY;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);


  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative"
      style={{ height: sectionHeight }}
    >
      <div
        className="h-screen flex items-center relative z-30 bg-charcoal"
        style={
          isPinned
            ? { position: "fixed", top: 0, left: 0, right: 0, zIndex: 30 }
            : { position: "relative", zIndex: 1 }
        }
      >
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
              SYSTEMS BUILT FOR
              <br />
              <span className="gradient-text">GROWTH.</span>
            </h2>
            <p className="text-ash-gray text-lg md:text-xl">
              Scroll to explore the systems we build.
            </p>
          </div>

          <div className="relative" style={{ minHeight: 380 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={SERVICES[activeIndex].title}
                className="absolute inset-0 p-6 md:p-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className="relative bg-charcoal/60 backdrop-blur-sm rounded-2xl p-6 md:p-10"
                  style={{ minHeight: 460 }}
                >
                  <div className="flex items-center justify-start mb-6">
                    <div className="flex items-center gap-2">
                      {SERVICES.map((_, i) => (
                        <span
                          key={`progress-${i}`}
                          className={`w-4 h-4 rounded-full ${
                            i === activeIndex ? "bg-phoenix-gold" : "bg-phoenix-gold/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-end gap-10">
                    <div className="flex-1">
                      <h3 className="text-3xl md:text-4xl mb-4 text-pure-white">
                        {SERVICES[activeIndex].title}
                      </h3>
                      <p className="text-ash-gray text-lg mb-6">
                        {SERVICES[activeIndex].body}
                      </p>

                      <ul className="space-y-3 text-ash-gray border-l border-ash-gray/20 pl-4">
                        {SERVICES[activeIndex].bullets.map((bullet) => (
                          <li key={bullet}>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-12 relative inline-block z-0 overflow-visible">
                        <div
                          className="absolute -inset-8 rounded-full pointer-events-none"
                          style={{
                            background:
                              "radial-gradient(circle at center, rgba(245,194,85,0.7), rgba(229,138,64,0.35) 55%, rgba(229,138,64,0) 75%)",
                            filter: "blur(28px)",
                            opacity: 1,
                            zIndex: 0,
                          }}
                        />
                        <a
                          href={CALENDLY_CONSULTATION_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary inline-flex items-center relative z-10"
                          style={{
                            boxShadow:
                              "0 0 28px rgba(245,194,85,0.45), 0 0 60px rgba(229,138,64,0.35)",
                          }}
                        >
                          BOOK A CONSULTATION
                        </a>
                      </div>
                    </div>

                    <div className="w-full lg:w-1/3 flex items-center justify-center lg:items-end lg:justify-end lg:self-stretch relative z-0 overflow-visible">
                      <div
                        className="absolute -inset-12 rounded-3xl pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(circle at center, rgba(245,194,85,0.6), rgba(229,138,64,0.3) 55%, rgba(229,138,64,0) 75%)",
                          filter: "blur(45px)",
                          opacity: 1,
                          zIndex: 0,
                        }}
                      />
                      {SERVICES[activeIndex].imageSrc ? (
                        <img
                          src={SERVICES[activeIndex].imageSrc}
                          alt={`${SERVICES[activeIndex].title} preview`}
                          className={`object-contain rounded-xl relative z-10 self-end ${
                            SERVICES[activeIndex].title === "Custom App Solutions"
                              ? ""
                              : "w-full h-56"
                          }`}
                          style={{
                            filter:
                              "drop-shadow(0 0 26px rgba(245,194,85,0.45)) drop-shadow(0 0 60px rgba(229,138,64,0.3))",
                            ...(SERVICES[activeIndex].title === "Custom App Solutions"
                              ? { height: 480, width: "auto", maxWidth: 960 }
                              : {}),
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-56 rounded-xl bg-charcoal/60 backdrop-blur-sm relative z-10"
                          style={{
                            filter:
                              "drop-shadow(0 0 26px rgba(245,194,85,0.35)) drop-shadow(0 0 60px rgba(229,138,64,0.25))",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
