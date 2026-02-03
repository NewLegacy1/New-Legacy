"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validators/lead";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { X } from "lucide-react";

type LeadCaptureCtx = {
  openLeadForm: () => void;
};

const LeadCaptureContext = React.createContext<LeadCaptureCtx | null>(null);

export function useLeadCapture() {
  const ctx = React.useContext(LeadCaptureContext);
  if (!ctx) throw new Error("useLeadCapture must be used within LeadCaptureProvider");
  return ctx;
}

const SERVICE_OPTIONS = [
  "Custom Websites",
  "CRM Workflows",
  "Backend Systems",
  "Custom App Solutions",
  "Automation / AI Agents",
  "Not sure yet",
];

export function LeadCaptureProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [submitState, setSubmitState] = React.useState<
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success"; leadId: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      website: "",
      name: "",
      businessName: "",
      email: "",
      phone: "",
      websiteUrl: "",
      servicesInterested: [],
      message: "",
      preferredContact: "email",
      sourcePath: "",
      utm: {},
    },
    mode: "onBlur",
  });

  const openLeadForm = React.useCallback(() => {
    setSubmitState({ status: "idle" });
    // Best-effort context capture
    const url = new URL(window.location.href);
    const utm: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
      const v = url.searchParams.get(k);
      if (v) utm[k] = v;
    });
    form.setValue("sourcePath", url.pathname);
    form.setValue("utm", utm);
    setOpen(true);
  }, [form]);

  const close = React.useCallback(() => setOpen(false), []);

  // Escape to close + prevent background scroll
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  const onSubmit = async (values: LeadInput) => {
    setSubmitState({ status: "submitting" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message ?? data?.error ?? "Submission failed");
      }
      setSubmitState({ status: "success", leadId: String(data.leadId ?? "") });
      form.reset();
    } catch (e) {
      setSubmitState({
        status: "error",
        message: e instanceof Error ? e.message : "Submission failed",
      });
    }
  };

  return (
    <LeadCaptureContext.Provider value={{ openLeadForm }}>
      {children}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483647,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={close}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.72)",
            }}
          />

          <div
            style={{
              position: "relative",
              width: "min(720px, calc(100vw - 32px))",
              maxHeight: "calc(100vh - 40px)",
              overflow: "auto",
            }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="gradient-text text-sm font-semibold uppercase tracking-[0.22em]">
                      Contact
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-pure-white">
                      Tell us what you need
                    </h2>
                    <p className="mt-2 text-sm text-ash-gray">
                      We’ll reply within 1 business day.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={close}
                    className="rounded-full border border-ash-gray/20 bg-charcoal/70 p-3 text-pure-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              </CardHeader>

              <CardContent>
                {submitState.status === "error" ? (
                  <Alert variant="error" className="mb-4">
                    {submitState.message}
                  </Alert>
                ) : null}

                {submitState.status === "success" ? (
                  <Alert variant="success">
                    Submitted. We’ll reach out soon. Lead ID:{" "}
                    <span className="gradient-text font-semibold">{submitState.leadId}</span>
                  </Alert>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        {...form.register("website")}
                      />

                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
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
                              <FormLabel>Business name</FormLabel>
                              <FormControl>
                                <Input placeholder="Company LLC" {...field} />
                              </FormControl>
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
                                <Input type="email" placeholder="you@company.com" {...field} />
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
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(905) 555-1234" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="websiteUrl"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://…" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="servicesInterested"
                        render={({ field }) => {
                          const selected = new Set(field.value ?? []);
                          return (
                            <FormItem>
                              <FormLabel>Services you’re interested in *</FormLabel>
                              <div className="mt-3 grid gap-3 md:grid-cols-2">
                                {SERVICE_OPTIONS.map((opt) => {
                                  const checked = selected.has(opt);
                                  return (
                                    <label
                                      key={opt}
                                      className="flex items-center gap-3 rounded-xl border border-ash-gray/20 bg-charcoal/70 px-4 py-3 text-sm text-pure-white/90"
                                    >
                                      <Checkbox
                                        checked={checked}
                                        onChange={(e) => {
                                          const isChecked = (e.target as HTMLInputElement).checked;
                                          const next = new Set(selected);
                                          if (isChecked) next.add(opt);
                                          else next.delete(opt);
                                          field.onChange(Array.from(next));
                                        }}
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What are you trying to accomplish?</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="A quick summary of what you need, your timeline, and anything important…"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred reply</FormLabel>
                            <div className="mt-3 flex flex-wrap gap-3">
                              {[
                                { value: "email" as const, label: "Email" },
                                { value: "phone" as const, label: "Phone" },
                              ].map((opt) => {
                                const active = field.value === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => field.onChange(opt.value)}
                                    className={
                                      "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition"
                                    }
                                    style={{
                                      border: "1px solid rgba(255,255,255,0.12)",
                                      background: active
                                        ? "linear-gradient(135deg, rgba(245,194,85,0.22), rgba(229,138,64,0.18))"
                                        : "rgba(15,15,15,0.6)",
                                      color: "#fff",
                                    }}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button type="button" variant="ghost" onClick={close}>
                  Close
                </Button>
                {submitState.status !== "success" ? (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={submitState.status === "submitting"}
                  >
                    {submitState.status === "submitting" ? "Sending…" : "Send"}
                  </Button>
                ) : (
                  <Button type="button" onClick={close}>
                    Done
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : null}
    </LeadCaptureContext.Provider>
  );
}

