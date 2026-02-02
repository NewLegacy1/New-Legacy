"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { intakeSchema, type IntakeInput } from "@/lib/validators/intake";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const steps = [
  { key: "basics", title: "Basics" },
  { key: "brand", title: "Brand & Goals" },
  { key: "content", title: "Content & Proof" },
  { key: "structure", title: "Website Structure" },
  { key: "call", title: "Build Call & Revisions" },
  { key: "review", title: "Review & Submit" },
] as const;

type StepKey = (typeof steps)[number]["key"];

const timezones = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
].map((tz) => ({ value: tz, label: tz.replace("_", " ") }));

function ProgressDots({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-6">
      {steps.map((s, i) => {
        const active = i === currentIndex;
        const done = i < currentIndex;
        return (
          <div key={s.key} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ash-gray/30 bg-charcoal/70 text-xs font-semibold leading-none text-ash-gray",
                (active || done) && "border-phoenix-gold/40 bg-phoenix-gold/10"
              )}
            >
              <span className={active || done ? "text-phoenix-gold" : undefined}>
                {i + 1}
              </span>
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-ash-gray">
              {s.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function IntakePage() {
  const [step, setStep] = React.useState<StepKey>("basics");
  const [submitState, setSubmitState] = React.useState<
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success"; intakeId: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  // Dev UX: let you click through steps without required-field validation.
  // Production still validates on submit (server-side + client resolver).
  const RELAXED_WIZARD = process.env.NODE_ENV !== "production";

  const form = useForm<IntakeInput>({
    resolver: RELAXED_WIZARD ? undefined : zodResolver(intakeSchema),
    defaultValues: {
      website: "",
      name: "",
      businessName: "",
      email: "",
      phone: "",
      timezone: "",
      addressOrServiceArea: "",
      whatTheyDo: "",
      topGoal: "",
      targetCustomers: "",
      competitors: [],
      vibe: "",
      colors: "",
      fonts: "",
      logoUrl: "",
      services: [{ serviceName: "", shortDescription: "" }],
      showPricing: "not_sure",
      testimonials: [],
      portfolioUrls: [],
      teamInfo: "",
      faqs: [],
      pagesNeeded: [],
      ctaPreference: "",
      formsNeeded: [],
      integrations: "",
      tracking: "",
      attendees: "",
      schedulingPreference: "flexible",
      revisionNotes: "",
      approvalContact: "",
      communicationChannel: "email",
      deadline: "",
      deadlineAck: false,
      agreement: false,
      copyMode: "write_for_me",
    },
    mode: "onBlur",
  });

  const currentIndex = steps.findIndex((s) => s.key === step);

  const services = useFieldArray({
    control: form.control,
    name: "services",
  });
  const faqs = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const next = () => setStep(steps[Math.min(currentIndex + 1, steps.length - 1)].key);

  const back = () => {
    setStep(steps[Math.max(currentIndex - 1, 0)].key);
  };

  const onSubmit = async (values: IntakeInput) => {
    setSubmitState({ status: "submitting" });
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? data?.error ?? "Submission failed");
      }
      setSubmitState({ status: "success", intakeId: data.intakeId });
    } catch (e) {
      setSubmitState({
        status: "error",
        message: e instanceof Error ? e.message : "Submission failed",
      });
    }
  };

  if (submitState.status === "success") {
    return (
      <div className="min-h-screen bg-charcoal text-pure-white">
        <div className="container mx-auto px-4 pb-24 pt-32">
          <Card className="mx-auto max-w-3xl">
            <CardHeader>
              <p className="text-sm uppercase tracking-[0.3em] text-phoenix-gold/70">
                Intake submitted
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Thanks — next step is your build call.
              </h1>
              <p className="mt-3 text-sm text-ash-gray">
                We’ve received your intake and will reach out shortly. Your
                intake ID is{" "}
                <span className="gradient-text font-semibold">
                  {submitState.intakeId}
                </span>
                .
              </p>
            </CardHeader>
            <CardContent>
              <Separator />
              <div className="mt-6 space-y-4 text-sm text-ash-gray">
                <p className="text-pure-white">Here’s what to prepare:</p>
                <ul className="space-y-2">
                  {[
                    "Any existing logo files (SVG/PNG), brand colors, fonts",
                    "A short list of your services + pricing rules (if any)",
                    "Testimonials, before/after photos, portfolio examples",
                    "Access to your domain + hosting (if you already have it)",
                    "Any tracking pixels or analytics accounts you want installed",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-phoenix-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="/" className="btn-primary mt-6 inline-flex">
                  Back to home
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-pure-white">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 h-1/2 w-1/2 rounded-full bg-phoenix-gold/10 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-1/3 w-1/2 rounded-full bg-sunset-orange/10 blur-[150px]" />

        <div className="container mx-auto px-4 pb-24 pt-28">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-phoenix-gold/70">
              Client Intake
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Let’s build your next website the right way.
            </h1>
            <p className="mt-3 text-sm text-ash-gray">
              This takes ~5–8 minutes. Answer what you can—leave the rest blank
              and we’ll handle it on the call.
            </p>
            <ProgressDots currentIndex={currentIndex} />
          </header>

          <div className="mx-auto mt-10 max-w-4xl">
            {submitState.status === "error" ? (
              <Alert variant="error" className="mb-6">
                {submitState.message}
              </Alert>
            ) : null}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  {...form.register("website")}
                />

                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.22em]">
                          Step {currentIndex + 1} of {steps.length}
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-pure-white">
                          {steps[currentIndex].title}
                        </h2>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {step === "basics" ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Smith Roofing Co."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@business.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(555) 555-5555"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="timezone"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <FormLabel>Timezone *</FormLabel>
                              <FormControl>
                                <Select {...field}>
                                  <option value="">Select timezone…</option>
                                  {timezones.map((tz) => (
                                    <option key={tz.value} value={tz.value}>
                                      {tz.label}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="addressOrServiceArea"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <FormLabel>Address / service area</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Austin, TX + surrounding areas"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Helps us tailor maps, SEO, and location copy.
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : null}

                    {step === "brand" ? (
                      <div className="space-y-6">
                        <Tabs
                          value={form.watch("copyMode")}
                          onValueChange={(v) =>
                            form.setValue("copyMode", v as any)
                          }
                        >
                          <TabsList>
                            <TabsTrigger value="write_for_me">
                              Write it for me
                            </TabsTrigger>
                            <TabsTrigger value="i_will_provide">
                              I’ll provide copy
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="write_for_me">
                            <Alert variant="info">
                              Perfect. Give us rough notes—we’ll write polished,
                              conversion-focused copy and confirm it with you.
                            </Alert>
                          </TabsContent>
                          <TabsContent value="i_will_provide">
                            <Alert variant="warning">
                              Great. We’ll still structure it and suggest
                              improvements so it converts.
                            </Alert>
                          </TabsContent>
                        </Tabs>

                        <FormField
                          control={form.control}
                          name="whatTheyDo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What do you do? *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="We help homeowners replace roofs after storm damage…"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="topGoal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Top goal *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Get more booked estimates each week"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="targetCustomers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target customers</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Homeowners in Austin + suburbs, 30–60, need fast service…"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-pure-white">
                                Competitors (optional)
                              </p>
                              <p className="text-xs text-ash-gray">
                                Paste links (must start with https://).
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                const prev = form.getValues("competitors") ?? [];
                                form.setValue("competitors", [...prev, ""]);
                              }}
                            >
                              Add link
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {(form.watch("competitors") ?? []).map((_, idx) => (
                              <div key={idx} className="flex gap-3">
                                <Input
                                  placeholder="https://competitor.com"
                                  {...form.register(`competitors.${idx}` as const)}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => {
                                    const prev = form.getValues("competitors") ?? [];
                                    form.setValue(
                                      "competitors",
                                      prev.filter((_, i) => i !== idx)
                                    );
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                          <FormField
                            control={form.control}
                            name="vibe"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vibe</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Modern, bold, trustworthy"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="colors"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Colors</FormLabel>
                                <FormControl>
                                  <Input placeholder="Navy, white, gold" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="fonts"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fonts</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Montserrat, Inter…"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <FormLabel>Logo upload (optional)</FormLabel>
                          <Alert variant="warning">
                            Uploads are not configured yet. We’ll store a
                            placeholder filename. (We can add UploadThing or
                            Vercel Blob later.)
                          </Alert>
                          <input
                            type="file"
                            accept="image/*,.svg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              form.setValue("logoUrl", `placeholder://${file.name}`);
                            }}
                            className="text-sm text-ash-gray"
                          />
                          {form.watch("logoUrl") ? (
                            <p className="text-xs text-ash-gray">
                              Saved:{" "}
                              <span className="text-pure-white">
                                {form.watch("logoUrl")}
                              </span>
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    {step === "content" ? (
                      <div className="space-y-8">
                        <FormField
                          control={form.control}
                          name="services"
                          render={() => (
                            <FormItem className="space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-pure-white">
                                  Services
                                </p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() =>
                                    services.append({
                                      serviceName: "",
                                      shortDescription: "",
                                    })
                                  }
                                >
                                  Add service
                                </Button>
                              </div>
                              <div className="space-y-4">
                                {services.fields.map((s, idx) => (
                                  <div
                                    key={s.id}
                                    className="rounded-xl border border-ash-gray/20 bg-charcoal/70 p-4"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <p className="text-xs uppercase tracking-[0.18em] text-ash-gray">
                                        Service {idx + 1}
                                      </p>
                                      {services.fields.length > 1 ? (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          onClick={() => services.remove(idx)}
                                        >
                                          Remove
                                        </Button>
                                      ) : null}
                                    </div>
                                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                                      <Input
                                        placeholder="Service name"
                                        {...form.register(
                                          `services.${idx}.serviceName` as const
                                        )}
                                      />
                                      <Input
                                        placeholder="Short description"
                                        {...form.register(
                                          `services.${idx}.shortDescription` as const
                                        )}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showPricing"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Show pricing on the site?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  name={field.name}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <RadioGroupItem
                                    value="yes"
                                    label="Yes — show prices"
                                  />
                                  <RadioGroupItem
                                    value="no"
                                    label="No — request a quote"
                                  />
                                  <RadioGroupItem
                                    value="not_sure"
                                    label="Not sure yet"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <FormLabel>Photos / portfolio (optional)</FormLabel>
                          <Alert variant="warning">
                            Uploads are not configured yet. We’ll store
                            placeholder filenames.
                          </Alert>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files ?? []);
                              if (files.length === 0) return;
                              form.setValue(
                                "portfolioUrls",
                                files.map((f) => `placeholder://${f.name}`)
                              );
                            }}
                            className="text-sm text-ash-gray"
                          />
                          {form.watch("portfolioUrls")?.length ? (
                            <ul className="mt-2 space-y-1 text-xs text-ash-gray">
                              {form.watch("portfolioUrls").map((u) => (
                                <li key={u} className="truncate">
                                  {u}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>

                        <FormField
                          control={form.control}
                          name="teamInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Team info</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Who should we highlight? Any photos or roles?"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-pure-white">
                                FAQs (optional)
                              </p>
                              <p className="text-xs text-ash-gray">
                                Add the questions people ask you most.
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => faqs.append({ question: "", answer: "" })}
                            >
                              Add FAQ
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {faqs.fields.map((f, idx) => (
                              <div
                                key={f.id}
                                className="rounded-xl border border-ash-gray/20 bg-charcoal/70 p-4"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-xs uppercase tracking-[0.18em] text-ash-gray">
                                    FAQ {idx + 1}
                                  </p>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => faqs.remove(idx)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                                <div className="mt-3 space-y-3">
                                  <Input
                                    placeholder="Question"
                                    {...form.register(`faqs.${idx}.question` as const)}
                                  />
                                  <Textarea
                                    placeholder="Answer"
                                    {...form.register(`faqs.${idx}.answer` as const)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {step === "structure" ? (
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormItem>
                            <FormLabel>Pages needed</FormLabel>
                            <div className="grid gap-2">
                              {[
                                "Home",
                                "Services",
                                "About",
                                "Contact",
                                "Gallery / Portfolio",
                                "Pricing",
                                "FAQ",
                                "Reviews",
                              ].map((p) => {
                                const selected = form.watch("pagesNeeded").includes(p);
                                return (
                                  <label
                                    key={p}
                                    className="flex items-center gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white/90"
                                  >
                                    <Checkbox
                                      checked={selected}
                                      onChange={(e) => {
                                        const checked = (e.target as HTMLInputElement)
                                          .checked;
                                        const prev = form.getValues("pagesNeeded");
                                        form.setValue(
                                          "pagesNeeded",
                                          checked
                                            ? [...prev, p]
                                            : prev.filter((x) => x !== p)
                                        );
                                      }}
                                    />
                                    <span>{p}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </FormItem>
                          <FormField
                            control={form.control}
                            name="ctaPreference"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary CTA *</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <RadioGroupItem
                                      value="Call now"
                                      label="Call now"
                                    />
                                    <RadioGroupItem
                                      value="Book online"
                                      label="Book online"
                                    />
                                    <RadioGroupItem
                                      value="Get a quote"
                                      label="Get a quote"
                                    />
                                    <RadioGroupItem
                                      value="Contact form"
                                      label="Contact form"
                                    />
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormItem>
                          <FormLabel>Forms needed</FormLabel>
                          <div className="grid gap-2 md:grid-cols-2">
                            {[
                              "Contact form",
                              "Request a quote",
                              "Booking / calendar",
                              "Newsletter signup",
                            ].map((f) => {
                              const selected = form.watch("formsNeeded").includes(f);
                              return (
                                <label
                                  key={f}
                                  className="flex items-center gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white/90"
                                >
                                  <Checkbox
                                    checked={selected}
                                    onChange={(e) => {
                                      const checked = (e.target as HTMLInputElement)
                                        .checked;
                                      const prev = form.getValues("formsNeeded");
                                      form.setValue(
                                        "formsNeeded",
                                        checked
                                          ? [...prev, f]
                                          : prev.filter((x) => x !== f)
                                      );
                                    }}
                                  />
                                  <span>{f}</span>
                                </label>
                              );
                            })}
                          </div>
                        </FormItem>

                        <div className="grid gap-6 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="integrations"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Integrations</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="CRM, booking tool, email list, payments…"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="tracking"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tracking / analytics</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Google Analytics, Meta Pixel, Google Tag Manager…"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ) : null}

                    {step === "call" ? (
                      <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="attendees"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Who will attend the call?</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Name(s) + role(s)"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="schedulingPreference"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Scheduling preference</FormLabel>
                                <FormControl>
                                  <Select {...field}>
                                    <option value="asap">ASAP</option>
                                    <option value="this_week">This week</option>
                                    <option value="next_week">Next week</option>
                                    <option value="flexible">Flexible</option>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="revisionNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Revision notes / preferences</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Anything we should know about approvals, iterations, stakeholders…"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-6 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="approvalContact"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Approval contact *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Name + best email/phone"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="communicationChannel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred communication</FormLabel>
                                <FormControl>
                                  <Select {...field}>
                                    <option value="email">Email</option>
                                    <option value="sms">SMS</option>
                                    <option value="slack">Slack</option>
                                    <option value="other">Other</option>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="deadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Any deadlines?</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Need live by March 15"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <label className="flex items-start gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-4 text-sm text-pure-white/90">
                          <Checkbox
                            checked={!!form.watch("deadlineAck")}
                            onChange={(e) =>
                              form.setValue(
                                "deadlineAck",
                                (e.target as HTMLInputElement).checked
                              )
                            }
                          />
                          <span>
                            I understand timelines depend on fast feedback and
                            approvals.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-4 text-sm text-pure-white/90">
                          <Checkbox
                            checked={!!form.watch("agreement")}
                            onChange={(e) =>
                              form.setValue(
                                "agreement",
                                (e.target as HTMLInputElement).checked
                              )
                            }
                          />
                          <span>
                            I agree to provide accurate info and respond to
                            requests for approvals. *
                          </span>
                        </label>
                        {form.formState.errors.agreement ? (
                          <p className="text-xs text-sunset-orange">
                            {String(form.formState.errors.agreement.message)}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    {step === "review" ? (
                      <div className="space-y-6">
                        <Alert variant="info">
                          Review your answers below. You can jump back to any
                          section to edit.
                        </Alert>

                        {[
                          {
                            title: "Basics",
                            go: "basics" as const,
                            lines: [
                              form.getValues("name"),
                              form.getValues("businessName"),
                              form.getValues("email"),
                              form.getValues("phone"),
                              form.getValues("timezone"),
                            ],
                          },
                          {
                            title: "Brand & Goals",
                            go: "brand" as const,
                            lines: [
                              `What you do: ${form.getValues("whatTheyDo")}`,
                              `Top goal: ${form.getValues("topGoal")}`,
                              `Copy mode: ${form.getValues("copyMode")}`,
                            ],
                          },
                          {
                            title: "Services",
                            go: "content" as const,
                            lines: form
                              .getValues("services")
                              .map(
                                (s) => `${s.serviceName}: ${s.shortDescription}`
                              ),
                          },
                          {
                            title: "Structure",
                            go: "structure" as const,
                            lines: [
                              `CTA: ${form.getValues("ctaPreference")}`,
                              `Pages: ${form.getValues("pagesNeeded").join(", ")}`,
                              `Forms: ${form.getValues("formsNeeded").join(", ")}`,
                            ],
                          },
                          {
                            title: "Build Call",
                            go: "call" as const,
                            lines: [
                              `Approval: ${form.getValues("approvalContact")}`,
                              `Channel: ${form.getValues("communicationChannel")}`,
                              `Deadline: ${form.getValues("deadline") || "—"}`,
                            ],
                          },
                        ].map((section) => (
                          <div
                            key={section.title}
                            className="rounded-xl border border-ash-gray/20 bg-charcoal/70 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-pure-white">
                                {section.title}
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setStep(section.go)}
                              >
                                Edit
                              </Button>
                            </div>
                            <ul className="mt-3 space-y-1 text-xs text-ash-gray">
                              {section.lines
                                .filter(Boolean)
                                .slice(0, 8)
                                .map((l) => (
                                  <li key={l} className="truncate">
                                    {l}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>

                  <CardFooter>
                    <Separator />
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={back}
                        disabled={currentIndex === 0 || submitState.status === "submitting"}
                      >
                        Back
                      </Button>

                      {step === "review" ? (
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={submitState.status === "submitting"}
                        >
                          {submitState.status === "submitting"
                            ? "Submitting…"
                            : "Submit Intake"}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="primary"
                          onClick={next}
                          disabled={submitState.status === "submitting"}
                        >
                          Next
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

