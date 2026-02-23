"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crmIntakeSchema, type CrmIntakeInput } from "@/lib/validators/crm-intake";
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
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const steps = [
  { key: "basics", title: "Business Basics" },
  { key: "setup", title: "Current Setup" },
  { key: "leads", title: "Lead Flow" },
  { key: "goals", title: "CRM Goals" },
  { key: "automation", title: "Automation" },
  { key: "team", title: "Team & Data" },
  { key: "priority", title: "Priority & Budget" },
  { key: "review", title: "Review & Submit" },
] as const;

type StepKey = (typeof steps)[number]["key"];

function HomeLogoLink() {
  return (
    <a
      href="/"
      aria-label="Back to home"
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 50,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/new-legacy-logo.png"
        alt="New Legacy AI"
        style={{ width: 64, height: 64 }}
      />
    </a>
  );
}

function ProgressDots({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-8">
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

export default function CrmIntakePage() {
  const [step, setStep] = React.useState<StepKey>("basics");
  const [submitState, setSubmitState] = React.useState<
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success"; intakeId: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const RELAXED_WIZARD = process.env.NODE_ENV !== "production";

  const form = useForm<CrmIntakeInput>({
    resolver: RELAXED_WIZARD ? undefined : zodResolver(crmIntakeSchema),
    defaultValues: {
      website: "",
      businessName: "",
      websiteUrl: "",
      primaryContactName: "",
      email: "",
      phone: "",
      industryNiche: "",
      currentCrmStatus: "no_crm",
      currentCrmPlatforms: [],
      currentCrmUsage: [],
      currentSystemPainPoints: "",
      leadSources: [],
      currentLeadProcess: "",
      leadsGetMissed: "sometimes",
      crmGoals: [],
      idealOutcome90Days: "",
      desiredAutomations: [],
      integrationNeeds: "",
      teamSize: "just_me",
      needsDifferentPermissions: false,
      hasExistingData: false,
      existingDataLocation: "",
      urgency: "exploring",
      mainProblemToSolve: "",
      budgetRange: "not_specified",
      additionalNotes: "",
      agreement: false,
    },
    mode: "onBlur",
  });

  const currentIndex = steps.findIndex((s) => s.key === step);

  const next = () => setStep(steps[Math.min(currentIndex + 1, steps.length - 1)].key);

  const back = () => {
    setStep(steps[Math.max(currentIndex - 1, 0)].key);
  };

  const onSubmit = async (values: CrmIntakeInput) => {
    setSubmitState({ status: "submitting" });
    try {
      const res = await fetch("/api/crm-intake", {
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
        <div style={{ position: "relative" }}>
          <HomeLogoLink />
        </div>
        <div className="container mx-auto px-4 pb-24 pt-32">
          <Card className="mx-auto max-w-3xl">
            <CardHeader>
              <p className="text-sm uppercase tracking-[0.3em] text-phoenix-gold/70">
                CRM Intake submitted
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Thanks — we'll be in touch shortly.
              </h1>
              <p className="mt-3 text-sm text-ash-gray">
                We've received your CRM intake and will reach out to discuss your custom build. Your
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
                <p className="text-pure-white">What happens next:</p>
                <ul className="space-y-2">
                  {[
                    "We'll review your responses and pain points",
                    "Our team will prepare a customized CRM strategy",
                    "We'll schedule a discovery call to go deeper",
                    "You'll get a roadmap showing exactly how we'll solve your problems",
                    "We'll start building your automation machine",
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
        <HomeLogoLink />
        <div className="pointer-events-none absolute -top-24 right-0 h-1/2 w-1/2 rounded-full bg-phoenix-gold/10 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-1/3 w-1/2 rounded-full bg-sunset-orange/10 blur-[150px]" />

        <div
          className="container mx-auto px-4 pb-24"
          style={{ paddingTop: 75 }}
        >
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-phoenix-gold/70">
              Custom CRM Build
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Let's build a CRM that actually works for you.
            </h1>
            <p className="mt-3 text-sm text-ash-gray">
              This takes ~5–8 minutes. Answer what you can—we'll fill in the gaps on the call.
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
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Acme Corp" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="websiteUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="primaryContactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Contact Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John Smith" {...field} />
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
                              <FormLabel>Email Address *</FormLabel>
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
                              <FormLabel>Phone Number *</FormLabel>
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
                          name="industryNiche"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry / Niche</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Roofing, Real Estate, Consulting..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : null}

                    {step === "setup" ? (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="currentCrmStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Do you currently use a CRM?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  name={field.name}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <RadioGroupItem
                                    value="no_crm"
                                    label="No CRM at all"
                                  />
                                  <RadioGroupItem
                                    value="basic"
                                    label="Yes (basic)"
                                  />
                                  <RadioGroupItem
                                    value="advanced"
                                    label="Yes (advanced)"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormItem>
                          <FormLabel>If yes, which CRM are you currently using?</FormLabel>
                          <div className="grid gap-2 md:grid-cols-2">
                            {[
                              "GoHighLevel",
                              "HubSpot",
                              "Salesforce",
                              "Zoho",
                              "Pipedrive",
                              "Other",
                            ].map((platform) => {
                              const selected = form.watch("currentCrmPlatforms").includes(platform);
                              return (
                                <label
                                  key={platform}
                                  className="flex items-center gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white/90"
                                >
                                  <Checkbox
                                    checked={selected}
                                    onChange={(e) => {
                                      const checked = (e.target as HTMLInputElement).checked;
                                      const prev = form.getValues("currentCrmPlatforms");
                                      form.setValue(
                                        "currentCrmPlatforms",
                                        checked
                                          ? [...prev, platform]
                                          : prev.filter((x) => x !== platform)
                                      );
                                    }}
                                  />
                                  <span>{platform}</span>
                                </label>
                              );
                            })}
                          </div>
                        </FormItem>

                        <FormItem>
                          <FormLabel>What are you mainly using it for right now?</FormLabel>
                          <div className="grid gap-2 md:grid-cols-2">
                            {[
                              "Lead tracking",
                              "Sales pipeline",
                              "Follow-ups / reminders",
                              "Email or SMS automation",
                              "Appointment booking",
                              "Internal notes / customer management",
                            ].map((usage) => {
                              const selected = form.watch("currentCrmUsage").includes(usage);
                              return (
                                <label
                                  key={usage}
                                  className="flex items-center gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white/90"
                                >
                                  <Checkbox
                                    checked={selected}
                                    onChange={(e) => {
                                      const checked = (e.target as HTMLInputElement).checked;
                                      const prev = form.getValues("currentCrmUsage");
                                      form.setValue(
                                        "currentCrmUsage",
                                        checked
                                          ? [...prev, usage]
                                          : prev.filter((x) => x !== usage)
                                      );
                                    }}
                                  />
                                  <span>{usage}</span>
                                </label>
                              );
                            })}
                          </div>
                        </FormItem>

                        <FormField
                          control={form.control}
                          name="currentSystemPainPoints"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What do you HATE about your current system (or lack of one)?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us what's frustrating you..."
                                  rows={5}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Be specific — this helps us build the right solution.
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : null}

                    {step === "leads" ? (
                      <div className="space-y-6">
                        <FormItem>
                          <FormLabel>How do leads currently come in?</FormLabel>
                          <div className="grid gap-2 md:grid-cols-2">
                            {[
                              "Website forms",
                              "Phone calls",
                              "Facebook / Instagram ads",
                              "Google Ads",
                              "Referrals",
                              "Walk-ins",
                              "Other",
                            ].map((source) => {
                              const selected = form.watch("leadSources").includes(source);
                              return (
                                <label
                                  key={source}
                                  className="flex items-center gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white/90"
                                >
                                  <Checkbox
                                    checked={selected}
                                    onChange={(e) => {
                                      const checked = (e.target as HTMLInputElement).checked;
                                      const prev = form.getValues("leadSources");
                                      form.setValue(
                                        "leadSources",
                                        checked
                                          ? [...prev, source]
                                          : prev.filter((x) => x !== source)
                                      );
                                    }}
                                  />
                                  <span>{source}</span>
                                </label>
                              );
                            })}
                          </div>
                        </FormItem>

                        <FormField
                          control={form.control}
                          name="currentLeadProcess"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What happens AFTER a lead comes in right now?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Walk us through your current process..."
                                  rows={5}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="leadsGetMissed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Do leads ever get missed, forgotten, or followed up late?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  name={field.name}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <RadioGroupItem value="often" label="Yes, often" />
                                  <RadioGroupItem value="sometimes" label="Sometimes" />
                                  <RadioGroupItem value="rarely" label="Rarely" />
                                  <RadioGroupItem value="never" label="Never" />
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : null}

                    {step === "goals" ? (
                      <div className="space-y-6">
                        <FormItem>
                          <FormLabel>What do you want this CRM to help you do?</FormLabel>
                          <div className="grid gap-2">
                            {[
                              "Never miss a lead again",
                              "Automate follow-ups (text/email)",
                              "Track deal stages clearly",
                              "Book more appointments automatically",
                              "Improve close rate",
                              "Save time / reduce manual work",
                            ].map((goal) => {
                              const selected = form.watch("crmGoals").includes(goal);
                              return (
                                <label
                                  key={goal}
                                  className="flex items-center gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white/90"
                                >
                                  <Checkbox
                                    checked={selected}
                                    onChange={(e) => {
                                      const checked = (e.target as HTMLInputElement).checked;
                                      const prev = form.getValues("crmGoals");
                                      form.setValue(
                                        "crmGoals",
                                        checked
                                          ? [...prev, goal]
                                          : prev.filter((x) => x !== goal)
                                      );
                                    }}
                                  />
                                  <span>{goal}</span>
                                </label>
                              );
                            })}
                          </div>
                        </FormItem>

                        <FormField
                          control={form.control}
                          name="idealOutcome90Days"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                If this CRM worked perfectly, what would be different in your business 90 days from now?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Paint the picture..."
                                  rows={5}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is important — helps us design for your actual outcomes.
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : null}

                    {step === "automation" ? (
                      <div className="space-y-6">
                        <FormItem>
                          <FormLabel>Which automations do you want?</FormLabel>
                          <div className="grid gap-2">
                            {[
                              "Instant lead notifications",
                              "Automated SMS follow-ups",
                              "Automated email follow-ups",
                              "Missed call text-back",
                              "Appointment reminders",
                              "Pipeline stage automation",
                              "Internal task creation",
                            ].map((automation) => {
                              const selected = form.watch("desiredAutomations").includes(automation);
                              return (
                                <label
                                  key={automation}
                                  className="flex items-center gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white/90"
                                >
                                  <Checkbox
                                    checked={selected}
                                    onChange={(e) => {
                                      const checked = (e.target as HTMLInputElement).checked;
                                      const prev = form.getValues("desiredAutomations");
                                      form.setValue(
                                        "desiredAutomations",
                                        checked
                                          ? [...prev, automation]
                                          : prev.filter((x) => x !== automation)
                                      );
                                    }}
                                  />
                                  <span>{automation}</span>
                                </label>
                              );
                            })}
                          </div>
                        </FormItem>

                        <FormField
                          control={form.control}
                          name="integrationNeeds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Do you need the CRM to integrate with anything?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g. website, ads, calendar, Stripe, QuickBooks, Zapier, etc."
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : null}

                    {step === "team" ? (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="teamSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>How many people will use the CRM?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  name={field.name}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <RadioGroupItem value="just_me" label="Just me" />
                                  <RadioGroupItem value="2_5" label="2–5 users" />
                                  <RadioGroupItem value="6_10" label="6–10 users" />
                                  <RadioGroupItem value="10_plus" label="10+" />
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <label className="flex items-start gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-4 text-sm text-pure-white/90">
                          <Checkbox
                            checked={!!form.watch("needsDifferentPermissions")}
                            onChange={(e) =>
                              form.setValue(
                                "needsDifferentPermissions",
                                (e.target as HTMLInputElement).checked
                              )
                            }
                          />
                          <span>Do different users need different permissions?</span>
                        </label>

                        <Separator />

                        <label className="flex items-start gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-4 text-sm text-pure-white/90">
                          <Checkbox
                            checked={!!form.watch("hasExistingData")}
                            onChange={(e) =>
                              form.setValue(
                                "hasExistingData",
                                (e.target as HTMLInputElement).checked
                              )
                            }
                          />
                          <span>
                            Do you have existing leads or customer data that needs to be imported?
                          </span>
                        </label>

                        {form.watch("hasExistingData") ? (
                          <FormField
                            control={form.control}
                            name="existingDataLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  If yes, where is that data currently stored?
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Excel, old CRM, Google Sheets..."
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ) : null}
                      </div>
                    ) : null}

                    {step === "priority" ? (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="urgency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>How urgent is this CRM build?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  name={field.name}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <RadioGroupItem
                                    value="asap"
                                    label="ASAP (this is hurting us now)"
                                  />
                                  <RadioGroupItem
                                    value="30_days"
                                    label="Within 30 days"
                                  />
                                  <RadioGroupItem
                                    value="60_90_days"
                                    label="Within 60–90 days"
                                  />
                                  <RadioGroupItem
                                    value="exploring"
                                    label="Just exploring"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="mainProblemToSolve"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                What is the main problem you want this CRM to solve first?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Be specific..."
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="budgetRange"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Do you have a budget range allocated for this CRM build?
                              </FormLabel>
                              <FormControl>
                                <Select {...field}>
                                  <option value="not_specified">Prefer not to say</option>
                                  <option value="under_1k">Under $1,000</option>
                                  <option value="1k_3k">$1,000–$3,000</option>
                                  <option value="3k_5k">$3,000–$5,000</option>
                                  <option value="5k_plus">$5,000+</option>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="additionalNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Anything else we should know before building this?</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any additional context, constraints, or requirements..."
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

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
                            I agree to provide accurate information and respond to requests for clarification. *
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
                          Review your answers below. You can jump back to any section to edit.
                        </Alert>

                        {[
                          {
                            title: "Business Basics",
                            go: "basics" as const,
                            lines: [
                              form.getValues("businessName"),
                              form.getValues("primaryContactName"),
                              form.getValues("email"),
                              form.getValues("phone"),
                              form.getValues("industryNiche"),
                            ],
                          },
                          {
                            title: "Current Setup",
                            go: "setup" as const,
                            lines: [
                              `CRM Status: ${form.getValues("currentCrmStatus")}`,
                              `Platforms: ${form.getValues("currentCrmPlatforms").join(", ") || "—"}`,
                              `Pain Points: ${form.getValues("currentSystemPainPoints") || "—"}`,
                            ],
                          },
                          {
                            title: "Lead Flow",
                            go: "leads" as const,
                            lines: [
                              `Sources: ${form.getValues("leadSources").join(", ") || "—"}`,
                              `Leads Missed: ${form.getValues("leadsGetMissed")}`,
                            ],
                          },
                          {
                            title: "Goals & Automation",
                            go: "goals" as const,
                            lines: [
                              `Goals: ${form.getValues("crmGoals").join(", ") || "—"}`,
                              `Automations: ${form.getValues("desiredAutomations").join(", ") || "—"}`,
                            ],
                          },
                          {
                            title: "Priority & Budget",
                            go: "priority" as const,
                            lines: [
                              `Urgency: ${form.getValues("urgency")}`,
                              `Budget: ${form.getValues("budgetRange")}`,
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
                            : "Submit CRM Intake"}
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
