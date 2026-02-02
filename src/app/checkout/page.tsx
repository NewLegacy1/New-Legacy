"use client";

import { useMemo, useState } from "react";

type PlanType = "website" | "bundle";

type Addon = {
  id: string;
  name: string;
  description: string;
  setup: number;
  monthly: number;
};

const addons: Addon[] = [
  {
    id: "instant-lead-follow-up",
    name: "Instant Lead Follow-Up",
    description: "Automatically text and email new leads instantly.",
    setup: 75,
    monthly: 19,
  },
  {
    id: "missed-call-text-back",
    name: "Missed Call Text-Back",
    description: "Turn missed calls into second chances.",
    setup: 75,
    monthly: 19,
  },
  {
    id: "review-automation",
    name: "Review Automation",
    description: "Get more 5-star reviews automatically.",
    setup: 75,
    monthly: 19,
  },
  {
    id: "lead-dashboard",
    name: "Lead Dashboard",
    description: "See how many leads your site produces.",
    setup: 75,
    monthly: 19,
  },
];

const bundleIncludes = [
  "Instant Lead Follow-Up",
  "Missed Call Text-Back",
  "Review Automation",
  "Lead Activity Dashboard",
];

const bundlePricing = { setup: 497, monthly: 99 };
const websitePricing = { setup: 397, monthly: 19 };

const currency = (amount: number) => `$${amount.toFixed(0)}`;

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("bundle");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"features" | "timeline">(
    "features"
  );
  const [bundleAddonsOpen, setBundleAddonsOpen] = useState(false);

  const totals = useMemo(() => {
    if (selectedPlan === "bundle") {
      return {
        setup: bundlePricing.setup,
        monthly: bundlePricing.monthly,
      };
    }

    const addonTotals = selectedAddons.reduce(
      (acc, addonId) => {
        const addon = addons.find((item) => item.id === addonId);
        if (!addon) return acc;
        acc.setup += addon.setup;
        acc.monthly += addon.monthly;
        return acc;
      },
      { setup: 0, monthly: 0 }
    );

    return {
      setup: websitePricing.setup + addonTotals.setup,
      monthly: websitePricing.monthly + addonTotals.monthly,
    };
  }, [selectedPlan, selectedAddons]);

  const selectionPayload = {
    plan: selectedPlan,
    addons: selectedPlan === "bundle" ? [] : selectedAddons,
    setupTotal: totals.setup,
    monthlyTotal: totals.monthly,
  };

  const isBundle = selectedPlan === "bundle";

  return (
    <div className="min-h-screen bg-charcoal text-pure-white">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 h-1/2 w-1/2 rounded-full bg-phoenix-gold/10 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-1/3 w-1/2 rounded-full bg-sunset-orange/10 blur-[150px]" />
        <div className="container mx-auto px-4 pb-24 pt-32">
          <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-phoenix-gold/70">
                New Legacy AI
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Choose Your Setup
              </h1>
              <p className="mt-2 max-w-2xl text-base text-ash-gray">
                Switch anytime. You can add or remove features later.
              </p>
            </div>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="space-y-6">
              <div
                className="grid gap-6 md:grid-cols-2"
                style={{ alignItems: "stretch" }}
              >
                <div className="flex flex-col gap-3" style={{ height: "100%" }}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold uppercase tracking-[0.2em] gradient-text">
                      CUSTOM WEBSITE BUILD
                    </p>
                    <span
                      className="inline-block rounded-full bg-gradient-phoenix px-4 py-2 text-xs font-semibold leading-none text-charcoal shadow-lg"
                      style={{ visibility: "hidden" }}
                      aria-hidden="true"
                    >
                      SAVE $300
                    </span>
                  </div>
                  <div
                    className={`flex flex-col gap-6 rounded-xl border p-6 text-left transition-all duration-300 ${
                      selectedPlan === "website"
                        ? "glow-gold border-phoenix-gold/70 bg-charcoal/90 ring-1 ring-phoenix-gold/15"
                        : "border-ash-gray/20 bg-charcoal/70 hover:border-phoenix-gold/40 hover:shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
                    }`}
                    style={{ minHeight: 325, height: "100%" }}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPlan("website")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedPlan("website");
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm text-pure-white/80">
                        Premium, conversion-focused website
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ash-gray">
                      <span className="pill-gradient-outline px-4 py-2">
                        <span className="font-semibold leading-none gradient-text">
                          Setup from {currency(websitePricing.setup)}
                        </span>
                      </span>
                      <span className="pill-gradient-outline px-4 py-2">
                        <span className="font-semibold leading-none gradient-text">
                          {currency(websitePricing.monthly)}/mo
                        </span>
                      </span>
                    </div>
                    <div className="space-y-3 text-sm text-pure-white/80">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-phoenix-gold/70">
                        Includes
                      </p>
                      <ul className="space-y-2 leading-relaxed">
                        <li className="flex items-start gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-phoenix-gold" />
                          <span>Custom website build</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-phoenix-gold" />
                          <span>Conversion-first messaging</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-phoenix-gold" />
                          <span>Launch-ready design</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-phoenix-gold" />
                          <span>Mobile-first responsive layout</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan("website")}
                      className={`mt-6 w-full cursor-pointer pointer-events-auto ${
                        selectedPlan === "website"
                          ? "btn-secondary border-phoenix-gold/70 text-phoenix-gold/90 bg-transparent"
                          : "btn-primary"
                      }`}
                    >
                      Select Website Only
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3" style={{ height: "100%" }}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold uppercase tracking-[0.2em] gradient-text">
                      GROWTH SYSTEM BUNDLE
                    </p>
                    <span className="inline-block rounded-full bg-gradient-phoenix px-4 py-2 text-xs font-semibold leading-none text-charcoal shadow-lg">
                      SAVE $300
                    </span>
                  </div>
                  <div
                    className={`relative flex flex-col gap-6 overflow-hidden rounded-xl border p-6 text-left transition-all duration-300 ${
                      isBundle
                        ? "glow-gold border-phoenix-gold/70 bg-charcoal/90 ring-1 ring-phoenix-gold/15"
                        : "border-ash-gray/20 bg-charcoal/70 hover:border-phoenix-gold/40 hover:shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
                    }`}
                    style={{ minHeight: 325, height: "100%" }}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPlan("bundle")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedPlan("bundle");
                      }
                    }}
                  >
                    <div className="relative flex items-start justify-between gap-4">
                      <p className="text-sm text-pure-white/80">
                        Built for capture, follow-up, and conversions
                      </p>
                    </div>
                    <div className="relative flex flex-wrap items-center gap-2 text-xs text-ash-gray">
                      <span className="pill-gradient-outline px-4 py-2">
                        <span className="font-semibold leading-none gradient-text">
                          Setup {currency(bundlePricing.setup)}
                        </span>
                      </span>
                      <span className="pill-gradient-outline px-4 py-2">
                        <span className="font-semibold leading-none gradient-text">
                          {currency(bundlePricing.monthly)}/mo
                        </span>
                      </span>
                    </div>
                    <div className="relative space-y-3 text-sm text-pure-white/80">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-phoenix-gold/70">
                        Includes
                      </p>
                      <p className="text-sm text-pure-white/80">
                        Growth website build +{" "}
                        <span className="text-pure-white/70">
                          {bundleIncludes.length} automations
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setBundleAddonsOpen((prev) => !prev)}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-phoenix-gold/90 hover:text-phoenix-gold"
                        aria-expanded={bundleAddonsOpen}
                        aria-controls="bundle-includes"
                      >
                        {bundleAddonsOpen ? "Hide add-ons" : "View add-ons"}
                        <span
                          style={{
                            transform: bundleAddonsOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 200ms ease",
                          }}
                          aria-hidden="true"
                        >
                          <ChevronDownIcon />
                        </span>
                      </button>

                      <div
                        id="bundle-includes"
                        className="overflow-hidden"
                        style={{
                          maxHeight: bundleAddonsOpen ? 320 : 0,
                          opacity: bundleAddonsOpen ? 1 : 0,
                          transition: "max-height 300ms ease, opacity 300ms ease",
                        }}
                      >
                        <ul className="mt-3 space-y-2 leading-relaxed">
                          {bundleIncludes.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-1 h-2 w-2 rounded-full bg-phoenix-gold" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan("bundle")}
                      className={`mt-6 w-full cursor-pointer pointer-events-auto ${
                        isBundle
                          ? "btn-secondary border-phoenix-gold/70 text-phoenix-gold/90 bg-transparent"
                          : "btn-primary"
                      }`}
                    >
                      Select Bundle
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-ash-gray/20 bg-charcoal/80 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-lg font-semibold">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-phoenix-gold/10 text-phoenix-gold">
                    <SparkIcon />
                  </span>
                  <div>
                    Optional add-ons
                    <p className="mt-1 text-xs text-ash-gray">
                      Add only what makes sense for your business.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {addons.map((addon) => {
                    const disabled = isBundle;
                    const checked = selectedAddons.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex flex-col gap-3 rounded-xl border px-4 py-4 transition sm:flex-row sm:items-start sm:justify-between ${
                          disabled
                            ? "border-ash-gray/10 bg-charcoal/60 text-ash-gray"
                            : checked
                            ? "glow-gold-soft border-phoenix-gold/60 bg-charcoal/95 text-pure-white"
                            : "border-ash-gray/20 bg-charcoal/70 text-pure-white/80 hover:border-phoenix-gold/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 accent-phoenix-gold"
                            disabled={disabled}
                            checked={checked}
                            onChange={() => {
                              if (disabled) return;
                              setSelectedAddons((prev) =>
                                prev.includes(addon.id)
                                  ? prev.filter((id) => id !== addon.id)
                                  : [...prev, addon.id]
                              );
                            }}
                          />
                          <div>
                            <p className="text-sm font-semibold">
                              {addon.name}
                            </p>
                            <p className="mt-1 text-xs text-ash-gray">
                              {addon.description}
                            </p>
                          </div>
                        </div>
                        <div className="ml-auto flex shrink-0 flex-col items-end gap-1 text-right text-xs text-ash-gray">
                          <div className="flex items-baseline gap-2">
                            <span>Setup</span>
                            <span
                              className={disabled ? "text-ash-gray" : "gradient-text font-semibold"}
                            >
                              {currency(addon.setup)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span>Monthly</span>
                            <span
                              className={disabled ? "text-ash-gray" : "gradient-text font-semibold"}
                            >
                              {currency(addon.monthly)}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                  {isBundle && (
                    <p className="text-xs text-ash-gray">
                      Bundle includes all add-ons and overrides manual
                      selections.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-ash-gray/20 bg-charcoal/80 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold tracking-[0.12em] gradient-text">
                      WHAT’S INCLUDED
                    </p>
                  </div>
                  <div className="gradient-border-outline bg-charcoal/70 p-1 text-xs uppercase tracking-[0.18em]">
                    <button
                      type="button"
                      onClick={() => setActiveTab("features")}
                      className={`rounded-full px-4 py-2 transition ${
                        activeTab === "features"
                          ? "bg-phoenix-gold/10"
                          : "text-ash-gray hover:text-phoenix-gold"
                      }`}
                    >
                      <span
                        className={
                          activeTab === "features" ? "gradient-text" : undefined
                        }
                      >
                        Included
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("timeline")}
                      className={`rounded-full px-4 py-2 transition ${
                        activeTab === "timeline"
                          ? "bg-phoenix-gold/10"
                          : "text-ash-gray hover:text-phoenix-gold"
                      }`}
                    >
                      <span
                        className={
                          activeTab === "timeline" ? "gradient-text" : undefined
                        }
                      >
                        Timeline
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  {activeTab === "features" ? (
                    <div className="space-y-6 text-sm text-ash-gray">
                      <div className="space-y-3">
                        <p className="text-base font-semibold text-pure-white">
                          Custom Website Build
                        </p>
                        <ul className="space-y-2">
                          {[
                            "Fully custom website built for your business",
                            "Designed to increase trust and customer action",
                            "Mobile-first and easy to use",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-1 h-2 w-2 rounded-full bg-phoenix-gold" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <p className="text-base font-semibold text-pure-white">
                          Conversion-Focused Design
                        </p>
                        <ul className="space-y-2">
                          {[
                            "Clear messaging and obvious next steps",
                            "Built to reduce hesitation and confusion",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-1 h-2 w-2 rounded-full bg-phoenix-gold" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <p className="text-base font-semibold text-pure-white">
                          Launch-Ready
                        </p>
                        <ul className="space-y-2">
                          {[
                            "Polished, professional design",
                            "Ready to go live once approved",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-1 h-2 w-2 rounded-full bg-phoenix-gold" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-ash-gray">
                          (Optional systems and automations can be added during
                          checkout or later.)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-sm text-ash-gray">
                      <p className="text-base font-semibold tracking-[0.12em] text-phoenix-gold">
                        TIMELINE
                      </p>
                      <ul className="space-y-4">
                        {[
                          {
                            title: "Start Immediately",
                            detail: "We begin as soon as checkout is complete.",
                          },
                          {
                            title: "First Version",
                            detail: "Delivered within 7–10 business days.",
                          },
                          {
                            title: "Revisions & Launch",
                            detail:
                              "We make adjustments based on your feedback, then finalize and launch.",
                          },
                        ].map((step) => (
                          <li key={step.title} className="flex items-start gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-phoenix-gold" />
                            <span>
                              <span className="font-semibold text-pure-white">
                                {step.title}
                              </span>
                              <span className="text-ash-gray">
                                {" "}
                                {step.detail}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-ash-gray/20 bg-charcoal/80 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold">Review your order</h2>
                <div className="mt-5 space-y-4 text-sm text-ash-gray">
                  <div className="rounded-xl border border-ash-gray/20 bg-charcoal/95 p-4">
                    <div className="flex items-center gap-3">
                      <span className="min-w-0 gradient-text font-semibold">
                        {selectedPlan === "bundle"
                          ? "Growth System Bundle"
                          : "Custom Website Build"}
                      </span>
                      {isBundle && (
                        <span className="ml-auto inline-block rounded-full bg-gradient-phoenix px-4 py-2 text-xs font-semibold leading-none text-charcoal shadow-lg">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-ash-gray">
                      Setup {currency(totals.setup)} · Monthly{" "}
                      {currency(totals.monthly)}/mo
                    </div>
                  </div>
                  {!isBundle && selectedAddons.length > 0 && (
                    <div className="rounded-lg border border-ash-gray/20 bg-charcoal/95 p-4 text-xs text-ash-gray">
                      <p className="mb-2 text-pure-white/80">Selected Add-Ons</p>
                      <ul className="space-y-1">
                        {selectedAddons.map((addonId) => {
                          const addon = addons.find((item) => item.id === addonId);
                          if (!addon) return null;
                          return <li key={addonId}>{addon.name}</li>;
                        })}
                      </ul>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-pure-white">Setup total</span>
                      <span className="gradient-text font-semibold">
                        {currency(totals.setup)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-pure-white">Monthly total</span>
                      <span className="gradient-text font-semibold">
                        {currency(totals.monthly)}/mo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-ash-gray/20 bg-charcoal/80 p-6 text-center backdrop-blur-sm">
                <p className="text-sm text-ash-gray">
                  Ready to move forward?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    console.log(selectionPayload);
                  }}
                  className="btn-primary mt-4 w-full"
                >
                  Continue to Checkout
                </button>
                <p className="mt-3 text-xs text-ash-gray">
                  No long-term contract. You’re always in control.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}


function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7l7-4z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

