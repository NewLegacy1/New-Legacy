import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/db/supabaseAdmin";
import { crmIntakeSchema } from "@/lib/validators/crm-intake";
import { Resend } from "resend";

export const runtime = "nodejs";

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateBucket: Map<string, { count: number; resetAt: number }> =
  (globalThis as any).__crmIntakeRateBucket ?? new Map();
(globalThis as any).__crmIntakeRateBucket = rateBucket;

function getClientIp() {
  const h = headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateBucket.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }
  entry.count += 1;
  return { ok: true };
}

export async function POST(req: Request) {
  const ip = getClientIp();
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return Response.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  const json = await req.json().catch(() => null);
  if (!json) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const RELAXED = process.env.NODE_ENV !== "production";

  let data: any = json;
  if (!RELAXED) {
    const parsed = crmIntakeSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    data = parsed.data;
  }

  // Honeypot spam protection
  if (typeof data.website === "string" && data.website.trim().length > 0) {
    return Response.json({ ok: true }, { status: 200 });
  }

  const record = {
    id: `crm_intake_${crypto.randomUUID()}`,
    createdAt: new Date(),
    businessName: String(data.businessName ?? ""),
    primaryContactName: String(data.primaryContactName ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    payload: data as any,
  };

  const hasSupabase =
    !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase) {
    return Response.json(
      {
        error: "Supabase not configured",
        message:
          "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (server-only).",
      },
      { status: 500 }
    );
  }

  let intakeId = record.id;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("crm_intake_submissions").insert({
      id: record.id,
      created_at: record.createdAt.toISOString(),
      business_name: record.businessName,
      primary_contact_name: record.primaryContactName,
      email: record.email,
      phone: record.phone,
      payload: record.payload,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    return Response.json(
      {
        error: "Database write failed",
        message: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }

  // Optional email notification
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.INTAKE_NOTIFY_EMAIL;
  if (resendKey && notifyEmail) {
    try {
      const resend = new Resend(resendKey);
      const from =
        process.env.INTAKE_FROM_EMAIL ??
        "New Legacy CRM <intake@updates.yourdomain.com>";
      await resend.emails.send({
        from,
        to: [notifyEmail],
        subject: `New CRM Intake: ${data.businessName} (${intakeId})`,
        text: [
          `CRM Intake ID: ${intakeId}`,
          `Business: ${data.businessName}`,
          `Contact: ${data.primaryContactName}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone}`,
          `Industry: ${data.industryNiche || "—"}`,
          `Urgency: ${data.urgency}`,
          `Budget: ${data.budgetRange}`,
          "",
          "— Full Payload —",
          JSON.stringify(data, null, 2),
        ].join("\n"),
      });
    } catch {
      // ignore email failures (submission still saved)
    }
  }

  return Response.json({ intakeId });
}
